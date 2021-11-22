import json
import aiohttp
import asyncio
import concurrent.futures

from bs4 import BeautifulSoup
from time import perf_counter
from concurrent.futures import ProcessPoolExecutor

# for Windows users
# asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

MAX_ASYNC_REQUESTS = 256


# TODO class wrapper for finding element & efficient resources use & warning logging 
# .expect(# of expected)        # number of expected found objects
# .on_unexpected()              # what to do if unexpected number of objects was found
# .parse()                      # if expected -> parse objects
# 
# namespace -> automatic exception handling 
# .try()
# .then()

# TODO load balancing
#   if requests are returned faster than parsed by process_pool, throttle back the GET requests
#   if pool is not loaded fully, increase frequency of GET request

"""
Recipe format:

{
    'title': str,
    'image_url': str,
    'small_image_url': str,
    'description': str,
    'ingredients_list': [
        {
            'heading': str,
            'ingredients': [ ... ]
        },
        ...
    ],
    'method': [
        str,
        ...
    ],
    source: str,
    time: {
        'preparation': str
        'cooking': str
    }
    'serving_size': str
}
"""




async def GET(sess, url):  # TODO return datatype from GET, w/ # of retries, status, response, url, etc.
    try:
        async with sess.get(url, allow_redirects=False) as res:
            if res.status != 200:  # TODO if failed try a few more times
                return (url, None)

            html = await res.text()
        
        return (url, html)
    except Exception as e:
        print(f"-->> Exception occured - {e.__class__} - url: {url}")
        return (url, None)



def parse(response):
    try:
        return _parse(response)
    except Exception as e:
        print(f"ERROR -> Parse -> Exception occured {e.__class__}")
        return {}


def _parse(response):
    url = response[0]
    html = response[1]

    document = BeautifulSoup(html, "html.parser")
    
    document = document.find('div', {'class': 'recipe-main-info'})

    title = None
    image_url = None
    preview_image_url = None
    ingredients_list = None
    description = None
    method = None
    prep_time = None
    cooking_time = None
    serving_size = None


    # find Title
    title_content = document.find('h1', {'class': 'content-title__text'})
    if title_content is None:
        print(f"Parser -> Critical Error: No Title Found for {url}")
    else:
        title = title_content.text

    
    leading_info_content = document.find('div', {'class': 'recipe-leading-info'})

    # find Image
    img_content = leading_info_content.find_all('div', {'class': 'recipe-media'})
    if len(img_content) == 0:
        print(f"Parser -> Did not find any images for {url}")
    elif len(img_content) > 1:
        print(f"Parser -> Found {len(img_content)} images for {url}")
    else:
        try:
            image_url = img_content[0].find('img')['srcset'].split(' ')[12]
            preview_image_url = img_content[0].find('img')['srcset'].split(' ')[4]
        except:
            print("Parser -> Didn't find ")
            image_url = img_content[0].find('img')['src']

    
    # find Description
    description_content = leading_info_content.find('p', {'class': 'recipe-description__text'})
    if description_content is None:
        print(f"Parser -> Description -> None was found for {url}")
    else:
        description = description_content.text
    

    # TODO fall back to full document search if none of the elements are found
    side_bar_content = leading_info_content.find('div', {'class': 'recipe-leading-info__side-bar'})

    # find Prep Time
    prep_time_content = side_bar_content.find('p', {'class': 'recipe-metadata__prep-time'})
    if prep_time_content is None:
        print(f"Parser -> Prep Time -> Did not find any for {url}")
    else:
        prep_time = prep_time_content.text
    
    
    # find Cooking Time
    cooking_time_content = side_bar_content.find('p', {'class': 'recipe-metadata__cook-time'})
    if cooking_time_content is None:
        print(f"Parser -> Cooking Time -> Did not find any for {url}")
    else:
        cooking_time = cooking_time_content.text
    
    
    # find Serving size
    serving_size_content = side_bar_content.find('p', {'class': 'recipe-metadata__serving'})
    if serving_size_content is None:
        print(f"Parser -> Serving size -> Did not find any for {url}")
    else:
        serving_size = serving_size_content.text


    
    # find Ingredients
    ingredients_content = document.find_all('div', {'class': 'recipe-ingredients-wrapper'})
    if len(ingredients_content) == 0:
        print(f"Parser -> Ingredients -> Did not find any content for {url}")
    elif len(ingredients_content) > 1:
        print(f"Parser -> Ingredients -> Found {len(ingredients_content)} contents for {url}")
    else:
        sub_sections = list(ingredients_content[0].children)[1:]
        ingredients_list = []
        new_sublist = False

        for subsection in sub_sections:
            if subsection.name == 'h3':  # ingredients list Title 
                ingredients_list.append({
                    'heading': subsection.text,
                    'ingredients': None,
                })
                new_sublist = True
            elif subsection.name == 'ul':  # ingredients list
                if new_sublist:
                    ingredients_list[-1]['ingredients'] = [ li.text for li in subsection.children ]
                    new_sublist = False
                else:
                    # print(f"Parser -> Ingredients -> list is whithout title")  # TODO use leveled warning/error system
                    ingredients_list.append({
                        'heading': None,
                        'ingredients': [ li.text for li in subsection.children ],
                    })
            else:
                print(f"Parser -> Ingredients -> Unexpected subsection type {subsection.name} for {url}")


    # find Method  TODO test find_all w/ 'class': 'recipe-method__list-item' or 'recipe-method__list-item-text'
    method_content = document.find_all('li', {'class': 'recipe-method__list-item'})
    if len(method_content) == 0:
        print(f"Parser -> Method -> Did not find any for {url}")
    else:
        method = []
        for li in method_content:
            method.append(li.text)


    return {
        'source': url,
        'title': title,
        'image_url': image_url,
        'preview_image_url': preview_image_url,
        'description': description,
        'ingredients_list': ingredients_list,
        'method': method,
        'time': {
            'preparation': prep_time,
            'cooking': cooking_time
        },
        'serving_size': serving_size
    }




async def crawl_all_categories():
    with open('recipes_w_images_urls.json', 'r') as f:
        data = json.load(f)

    all_urls = data['urls']
    recipes = []

    process_pool = ProcessPoolExecutor(24)
    futures = []
    tasks = []
    pages = 0

    async with aiohttp.ClientSession() as sess:
        for i, url in enumerate(all_urls):
            # if i > 1000:
            #     break
            task = asyncio.create_task( GET(sess, url) )
            tasks.append(task)

            if len(tasks) >= MAX_ASYNC_REQUESTS:
                done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
                tasks = list(pending)  # TODO ugly, work with 'set' rather than 'list'

                for task in done:
                    res = task.result()
                    if res[1] is None:  # retry if failed  # TODO possible infinite loop, design better execution logic
                        print(f"---->>>> Retrynig GET {res[0]}")
                        tasks.append( asyncio.create_task( GET(sess, res[0]) ) )
                    else:
                        pages += 1
                        if pages % 25 == 0:
                            print(f"Finished {pages} pages")
                        # recipes.append(parse(res))
                        futures.append( process_pool.submit(parse, res) )
    
        if len(tasks) > 0:  # TODO repeating block
            results = await asyncio.gather(*tasks)
            for res in results:
                if res[1] is None:  # retry if failed  # TODO possible infinite loop, design better execution logic
                    print(f"---->>>> Retrynig GET {res[0]}")
                    tasks.append( asyncio.create_task( GET(sess, res[0]) ) )
                else:
                    # recipes.append(parse(res))
                    futures.append( process_pool.submit(parse, res) )
    
    for future in concurrent.futures.as_completed(futures):
        res = future.result()
        recipes.append(res)

    return recipes


def main():
    start = perf_counter()
    recipes = asyncio.run(crawl_all_categories())

    elapsed = perf_counter() - start
    print(f"Took: {elapsed:.3f} s. | {len(recipes) / elapsed:.3f} obj/sec")
    print(len(recipes))
    
    with open("recipes.json", "w+") as f:
        json.dump(recipes, f,  indent = 2)  # indent = 0
        print(f.tell())
        
    print("Done")


if __name__ == '__main__':
    main()
