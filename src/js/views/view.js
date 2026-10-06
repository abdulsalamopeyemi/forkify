import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  _parentElement;

  _addContentToParentElement(value) {
    this._parentElement.insertAdjacentHTML('afterbegin', value);
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length < 1)) return;
    this._data = data;
    this._clear();
    this._addContentToParentElement(this._generateMarkup());
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
         <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
        `;

    this._clear();
    this._addContentToParentElement(markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `        
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div> 
          `;
    this._clear();
    this._addContentToParentElement(markup);
  }

  update(data) {
    this._data = data;
    const newEl = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newEl);
    const newNodeList = Array.from(newDOM.querySelectorAll('*'));
    const curEl = Array.from(this._parentElement.querySelectorAll('*'));

    newNodeList.forEach((newNode, i) => {
      const curNode = curEl[i];
      // console.log('currrent Node' newDOM)
      if (
        !newNode.isEqualNode(curNode) &&
        newNode.firstChild?.nodeValue.trim() !== ''
      ) {
        curNode.textContent = newNode.textContent;
      }
      if (!newNode.isEqualNode(curNode)) {
        Array.from(newNode.attributes).forEach(attr =>
          curNode.setAttribute(attr.name, attr.value),
        );
      }
    });
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div> `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    console.log(this._data);
  }
}

// console.log(View);
