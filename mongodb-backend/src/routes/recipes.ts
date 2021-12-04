import { Router } from 'express';
import { getRecipe, searchRecipe, getRecipesInPriceRange } from '../controllers/recipes';

export const recipesRouter = Router();

recipesRouter.route('/').get( getRecipe );
recipesRouter.route('/search').get( searchRecipe );
recipesRouter.route('/price').get( getRecipesInPriceRange );