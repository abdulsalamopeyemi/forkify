import View from './view.js';
// import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');

  _errorMessage = 'NO bookmarks yet. find a nice recipe and book marks it';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
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
        return markup;
      })
      .join('');
  }
}

export default new BookmarksView();
