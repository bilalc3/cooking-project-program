import re
import json
import argparse
from time import perf_counter


"""
[
    ingredient: {
        cnt: ,
        unit_types: {
            mass: [
                ... all values ...
            ],
            quantity: [
                ... all values ...
            ],
            ... 
        }
    }
]
"""

"""
name:{
    default:
    per_single: 
    per_g: 
    per_ml:

}
"""



expression_regex = re.compile("(\d+[.]?\d*)((g|kg|ml|l)(/| {1,})|( {1,}))")  # | tbsp|

def extract_units(ingredient_str, logs=None):
    extracted = expression_regex.findall(ingredient_str)
    
    if len(extracted) == 0:
        # logs['price_parser']['0match'].append(ingredient_str)
        pass
    elif len(extracted) > 1:
        # logs['price_parser']['1+match'].append(ingredient_str)
        pass
    else:
        quantity = float(extracted[0][0])
        unit = extracted[0][2]
        if unit == '':
           unit = 'quantity'
        
        if unit in ['kg', 'l']:
            quantity *= 1000
        
        if unit == 'quantity':
            # logs['price_parser']['1match'].append({'str': ingredient_str, 'quantity': quantity})
            return ('quantity', quantity)
        elif 'g' in unit:
            # logs['price_parser']['1match'].append({'str': ingredient_str, 'mass': quantity})
            return ('mass', quantity)
        elif 'l' in unit:
            # logs['price_parser']['1match'].append({'str': ingredient_str, 'volume': quantity})
            return ('volume', quantity)
    
    return ingredient_str

# def get_singular(word):
#     if len(word) < 3:
#         return word

#     if word[-1] == 's':
#         if word[-3] in ['a', 'e', 'i', 'o', 'u', 'y'] and word[:-2] == 'es':
#             return word[:-2]
#         return word[:-1]

#     return word

i_splitter = re.compile(", | {1,}|/|-|\u2013")

words_to_ignore = set(
    ['', '1', '2', 'tbsp', 'tsp', 'and','chopped', 'finely', 'ground', 'oz', 'or', '\u00bd', '4', '3', 'black', 'into', 'freshly']
)

prices = {
    'salt': { 'general': 0.1 },
    'pepper': { 'general': 0.1 },
    'oil': { 'general': 0.2 },
    'sugar': { 'general': 0.2 },
    'butter': { 'general': 1.2, 'mass': 0.013215859, 'quantity': 0.25 },
    'flour': { 'general': 1.5, 'mass': 0.002 },
    'garlic': { 'general': 0.5, 'quantity': 0.2 },
    'onion': { 'general': 0.3, 'quantity': 0.2, 'mass': 0.003  },
    'onions': { 'general': 0.3, 'quantity': 0.2, 'mass': 0.003  },
    'lemon': { 'general': 0.2 },
    'lime': { 'general': 0.3 },
    'milk': { 'general': 1.5, 'volume': 0.002, 'mass': 0.002 },
    'eggs': { 'general': 1.0, 'quantity': 0.3, },
    'egg': { 'general': 1.0, 'quantity': 0.3, },
    'chicken': { 'general': 3.0, 'mass': 0.008 },
    'tomatoes': { 'general': 2.0, 'mass': 0.00434, 'quantity': 0.5},
    'water': { 'general': 0.01 },
    'rice': { 'general': 1.2, 'mass': 0.00352422907 },
    'chocolate': { 'general': 1.0, 'mass': 0.00515 },
}

lines_cnt = 0

def parse_ingreident_price(ingredient_str, logs=None):
    global lines_cnt
    measure = extract_units(ingredient_str, logs)
        
    parts = i_splitter.split(ingredient_str)
   
    for part in parts:
        if part in prices:
            return prices[part]['general']

    lines_cnt += 1
    
    for part in parts:
        if part in words_to_ignore:
            continue
        
        if part in logs['price_parser']['data']:
            logs['price_parser']['data'][part]['cnt'] += 1
            logs['price_parser']['data'][part]['measures'].append( measure )
        else:
            logs['price_parser']['data'][part] = {
                'cnt': 0,
                'measures': [ measure ]
            }
            # logs['price_parser']['data'][part]['cnt'] = 0
            # logs['price_parser']['data'][part]['measures'] = [ measure ]
    

s_splitter = re.compile(" about | approximately | approx |, | {1,3}|/|-|\u2013")

def parse_serving_size(serving_str, logs=None):
    if serving_str is None:
        return None

    words = s_splitter.split(serving_str)
    
    for i, word in enumerate(words):
        if i == 0 and word.isdigit():
            # logs['serving_parser']['parsed'].append(word)
            return int(word)

        if ('Serves' in word or 'Makes' in word) and i + 1 < len(words) and words[i + 1].isdigit():
            # logs['serving_parser']['parsed'].append(words[i + 1])  # TODO remove all logs use
            return int(words[i + 1])
    
    if logs:
        logs['serving_parser']['failed'].append(serving_str)

    return None


UNKNOWN_INGREDIENT_PRICE = 0.5

def update_recipe(recipe, logs=None):
    total_price = 0

    for i_list in recipe['ingredients_list']:
        for ingredient_str in i_list['ingredients']:
            price = parse_ingreident_price(ingredient_str, logs)
            if isinstance(price, int):
                total_price += price
            else:
                total_price += UNKNOWN_INGREDIENT_PRICE
    
    if serving_size := parse_serving_size(recipe['serving_size'], logs):
        recipe['price_per_serving'] = round(total_price / serving_size, 2)
    else:
        recipe['price_per_serving'] = None

    recipe['total_price'] = round(total_price, 2)
    

def parse_args():
    parser = argparse.ArgumentParser(description='Allows manual/automated pricing of recipes based on ingredients')

    parser.add_argument('-p', '--recipes_path', type=str, required=True, help='path to data json file generated by scraper.py')

    parser.add_argument('--prices_path', type=str, required=True, help='path to json with ingredient prices')  # TODO add expected json format

    parser.add_argument('--default_price', type=float, default=0, help='global default price of an \
        ingredient that was not properly parsed, ie. expected average ingredient price')
    
    parser.add_argument('-m', '--manual_pricing', type=bool, help='creates json logs with failed parsing attempts starting with most frequent ones')
    parser.add_argument('--logs_name', type=str, default='parser_logs.json', help='logs filename')

    return parser.parse_args()


def main():
    args = parse_args()

    with open(args.recipes_path, 'r') as f:
        recipes = json.load(f)

    logs = None
    if args.manual_pricing:
        logs = { 
            'serving_parser':{ 'parsed': [], 'failed': [] }, 
            'price_parser': { 'data': {}, '0match': [], '1match': [], '1+match': [] }
        }

    start = perf_counter()

    for recipe in recipes:
        update_recipe(recipe, logs)

    print(f"Took {perf_counter() - start:.2f} s.")
    


    with open('recipes_w_price.json', "w") as f:
        json.dump(recipes, f, indent = 2)


    # logs['price_parser']['data'] = dict( sorted(logs['price_parser']['data'].items(), key=lambda x: x[1]['cnt'],reverse=True))
    # with open(args.logs_name, "w") as f:
    #     json.dump(logs, f, indent = 2)

    global lines_cnt
    print(lines_cnt)

    print(f"Items: {len(logs['price_parser']['data'].keys())}")
    print(f"0 matched: {len(logs['price_parser']['0match'])}")
    print(f"1 matched: {len(logs['price_parser']['1match'])}")
    print(f"1+ matched: {len(logs['price_parser']['1+match'])}")

if __name__ == '__main__':
    main()
