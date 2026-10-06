import RecipeView from './views/recipeView.js';
import * as model from './model.js';
import { MOAL_CLOSE_SEC } from './configure.js';
import SearchView from './views/resultView.js';
import { PaginationView } from './views/paginationView.js';
import SearchQueryView from './views/searchView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const recipeView = new RecipeView();
const searchView = new SearchView();
const paginationView = new PaginationView();
const searchQueryView = new SearchQueryView();

const loadRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0) update result view to mark selected result
    searchView.update(model.show10Recipe());
    bookmarkView.update(model.state.bookmarks);

    // 1) loading recipe
    await model.getRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err.message);
  }
};

// loadRecipe();
const getSearchRecipes = async function () {
  try {
    searchView.renderSpinner();

    // 1) get search query
    const query = searchQueryView.getQuery();
    if (!query) return;

    await model.searchRecipe(query);
    searchView.render(model.show10Recipe());
    paginationView.render(model.state.search);
  } catch (err) {
    searchView.renderError(err.message);
    console.error(err.message);
  }
};

const paginationBtnMovement = function (gotoPage) {
  // Update the recipe results

  searchView.render(model.show10Recipe(gotoPage));

  paginationView.render(model.state.search);
};

const paginationBtnSlider = function (gotoSlide) {
  if (gotoSlide) {
    model.showSlider(gotoSlide);
    paginationView.render(model.state.search);
  }
};

const servingsBtnCounter = function (newServings) {
  // update the servings
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  // Add/remove bookmarks
  console.log(model.state.recipe);
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update the recipeview
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

// ();
// cjbcjk

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadNewRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    // bookmarkView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    console.log(model.state.recipe);
    addRecipeView.renderMessage();
    setTimeout(() => {
      addRecipeView.toggleWindow();
      this._clear();
    }, MOAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('❌', err);
    addRecipeView.renderError(err.message);
    setTimeout(function () {
      addRecipeView.toggleWindow();
      console.log('hello world');
    }, MOAL_CLOSE_SEC * 1000);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.triggerWindowEvent(loadRecipe);
  searchQueryView.addHandlersearch(getSearchRecipes);
  paginationView.controlPaginationBtn(
    paginationBtnMovement,
    paginationBtnSlider,
  );
  // paginationView.controlPaginationBtn(paginationBtnSlider);
  recipeView.addservingsBtn(servingsBtnCounter);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  searchQueryView.addFocusInputField();
};

init();
const numPages = 10;
const totalpagesarray = new Array(numPages).map((el, _, arr) => (el = 10));
console.log(totalpagesarray);

// const adviceAPI = async function () {
//   try {
//     const res = await fetch('https://api.adviceslip.com/advice');
//     if (!res.ok) throw new Error(`There was an error with this url ${res.url}`);
//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.error(err.message);
//   }
// };

// const getAdviceBtn = document.querySelector('.advice');
// const showCount = document.querySelector('.count');
// console.log(showCount);
// let count = 0;
// console.log(getAdviceBtn);
// getAdviceBtn.addEventListener('click', async () => {
//   const showAdviceEl = document.querySelector('.show-advice-el');
//   const advices = await adviceAPI();

//   const { id, advice } = advices.slip;
//   console.log(advice);
//   showAdviceEl.textContent = advice;
//   showCount.textContent = count += 1;
// });

// adviceAPI();
// const  RegExpression (regrex)
