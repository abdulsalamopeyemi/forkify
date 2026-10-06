export default class SearchView {
  _parentElement = document.querySelector('.search');
  _errorMessage = 'No recipes found for your query! Please try again';
  _inputField = this._parentElement.querySelector('.search__field');

  getQuery() {
    const query = this._inputField.value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._inputField.value = '';
  }

  addHandlersearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
      this.querySelector('.search__field').blur();
    });
  }

  addFocusInputField() {
    this._inputField.focus();
  }
}
