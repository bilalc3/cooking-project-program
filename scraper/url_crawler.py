import json
import aiohttp
import asyncio
import concurrent.futures

from bs4 import BeautifulSoup
from time import perf_counter
from concurrent.futures import ProcessPoolExecutor

# for Windows users
# asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())



# As of Nov 2021
# 9894 recipes total
# 4300 recipes w/ images
domain = 'https://www.bbc.co.uk'
root = 'https://www.bbc.co.uk/food/recipes/a-z'


categories = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 
    'o', 'p', 'q', 'r', 's', 't', 'u', 
    'v', 'w', 'x', 'y', 'z', '0-9'
]


"""
Output JSON format:
{
    'domain': domain
    'root': root
    'urls': [
        ...
    ]
}
"""


async def get_urls_from_page(sess, category, page_id):
    page_url = f"{root}/{categories[category]}/{page_id}"
    
    try:
        async with sess.get(page_url, allow_redirects=False) as res:
            if res.status != 200:
                return category

            html = await res.text()
        
        return html
    except Exception as e:
        print(f"-->> Exception occured - {e.__class__} - url: {page_url}")
        return (category, page_id)



def parse(html):
    soup = BeautifulSoup(html, "html.parser")
    return [domain + content['href'] for content in soup.find_all('a', {'class': 'promo'}) if content.find('img')]


MAX_ASYNC_REQUESTS = 12


async def crawl_all_categories():
    category = 0
    finished_categories = 0
    page_ids = [1] * len(categories)
    tasks = []

    all_urls = []
    
    # thread_pool = ThreadPoolExecutor(48)
    process_pool = ProcessPoolExecutor(48)  # TODO rename to process pool
    futures = []
    pages = 0

    async with aiohttp.ClientSession() as sess:
        while finished_categories < len(categories):
            while not page_ids[category]:
                category += 1; category %= len(categories)

            next_category, next_page_id = category, page_ids[category]
            page_ids[category] += 1
            category += 1; category %= len(categories)

            task = asyncio.create_task( get_urls_from_page(sess, next_category, next_page_id) )
            tasks.append(task)  

            if len(tasks) >= MAX_ASYNC_REQUESTS:
                done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
                tasks = list(pending)  # TODO ugly, work with 'set' rather than 'list'

                for task in done:
                    res = task.result()
                    if isinstance(res, int):  # new page did not return 200, hence stop querying that category (returned in res)
                        finished_categories += 1 if page_ids[res] else 0
                        page_ids[res] = False
                    elif isinstance(res, tuple):  # exception occured -> retry  # TODO possible infinite loop, design better execution logic
                        print(f"---->>>> Retrynig c:{res[0]}  page:{res[1]}")
                        tasks.append( asyncio.create_task( get_urls_from_page(sess, *res) ) )
                    else:
                        pages += 1
                        if pages % 5 == 0:
                            print(f"Finished {pages} pages")
                        futures.append( process_pool.submit(parse, res) )
                        # all_urls.extend(res)
    
        if len(tasks) > 0:
            results = await asyncio.gather(*tasks)
            for res in results:
                if not isinstance(res, int) and not isinstance(res, tuple):  # TODO if failed, activate retry logic
                    futures.append( process_pool.submit(parse, res) )
                    # all_urls.extend(res)
    
    for future in concurrent.futures.as_completed(futures):
        res = future.result()
        all_urls.extend(res)

    return all_urls


def main():
    start = perf_counter()
    recipe_urls = asyncio.run(crawl_all_categories())
    print(f"Took: {perf_counter() - start:.3} s.")
    print(len(recipe_urls))
    
    with open("recipes_w_images_urls.json", "w+") as f:
        json.dump({
            'domain': domain,
            'root': root,
            'urls': recipe_urls
        }, f)
        
    
    print("Done")


if __name__ == '__main__':
    main()

