import {
  API_URL,
  RESULT_PER_PAGE,
  KEY,
  PAGINATION_BTN_PER_PAGE,
} from './configure.js';
import { AJAX } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RESULT_PER_PAGE,
    currentGroup: 1,
    paginationBtnPerPage: PAGINATION_BTN_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  const recipeObject = Object.entries(recipe).filter(key => {
    if (!key[0].includes('_')) return key;
  });

  const formatRecipe = Object.fromEntries(recipeObject);
  const sourceUrl = recipe.source_url;
  const cookingTime = recipe.cooking_time;
  const imageUrl = recipe.image_url;

  return {
    sourceUrl,
    cookingTime,
    imageUrl,
    ...formatRecipe,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const getRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);
    state.recipe = createRecipeObject(data);
    // console.log(state.recipe);
    if (state.bookmarks.some(recipe => recipe.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(err);
    console.log('hfbvfjbrhbrhvhbv');
    throw err;
  }
};

export const searchRecipe = async function (query = state.search.query) {
  try {
    state.search.query = query;
    console.log(state);
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(
      rec =>
        (state.recipe = {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
          ...(rec.key && { key: rec.key }),
        }),
    );
    state.search.page = 1;
    state.search.currentGroup = 1;
  } catch (err) {
    // console.error(`${err.message} 🔥🔥🔥🔥`);
    throw err;
  }
};

const events = ['hashchange'];
export const init = function (controller) {
  events.forEach(event => window.addEventListener(event, controller));
};

export const show10Recipe = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const showSlider = function (slide) {
  state.search.currentGroup = slide;
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServing) / state.recipe.servings), // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  );
  state.recipe.servings = newServing;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  // console.log(recipe, state.bookmarks);
  persitsBookmarks();
};

export const deleteBookmark = function (id) {
  const toRemovebookmarkIndex = state.bookmarks.findIndex(
    recipe => recipe.id === id,
  );

  // console.log(toRemovebookmarkIndex);
  state.bookmarks.splice(toRemovebookmarkIndex, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persitsBookmarks();
};

const persitsBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const getPersitBookmarks = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

getPersitBookmarks();

export const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadNewRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        entry => entry.at(0).startsWith('ingredient') && entry.at(1) !== '',
      )
      .map(ing => {
        const arr = ing
          .at(1)
          .replaceAll(' ', '')
          .split(',')
          .map(el => el.trim());
        if (arr.length !== 3)
          throw new Error(
            'Wrong ingredient format! please use the correct format',
          );

        const [quantity, unit, description] = arr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// console.log(''.)
