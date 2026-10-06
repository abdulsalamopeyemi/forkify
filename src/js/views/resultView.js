import View from './view';
import icons from 'url:../../img/icons.svg';

export default class SearchView extends View {
  _data;
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';

  _generateMarkup() {
    // console.log(this._data);
    const id = window.location.hash.slice(1);
    return this._data
      .map(recipe => {
        const markup = `
    <li class="preview" >
      <a class="preview__link ${id === recipe.id ? 'preview__link--active' : ''}" href="#${recipe.id}">
        <figure class="preview__fig">
          <img src="${recipe.imageUrl}" alt="${recipe.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>
            <div class="preview__user-generated ${recipe.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>

    `;
        // console.log(recipe);
        return markup;
      })
      .join('');
  }
}
