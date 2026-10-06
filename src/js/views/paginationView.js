import View from './view';
import * as model from '../model.js';
import icons from 'url:../../img/icons.svg';

export class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _data;

  /*
  
    netstat -ano | findstr :1234
  TCP    0.0.0.0:1234           0.0.0.0:0              LISTENING       23744
  TCP    [::]:1234              [::]:0                 LISTENING       23744

USER@DESKTOP-99FQF5N MINGW64 ~/OneDrive/Desktop/folkify-clone
$ tasklist //FI "PID eq 23744"

Image Name                     PID Session Name        Session#    Mem Usage
========================= ======== ================ =========== ============
node.exe                     23744 Console                    1      7,548 K

USER@DESKTOP-99FQF5N MINGW64 ~/OneDrive/Desktop/folkify-clone
$ taskkill //PID 23744 //F

  */

  controlPaginationBtn(handler, slider) {
    this._parentElement.addEventListener('click', function (e) {
      const paginationBtn = e.target.closest('.btn--page');
      const sliderBtn = e.target.closest('.btn--slide');
      if (paginationBtn) {
        const gotoPage = +paginationBtn.dataset.page;
        handler(gotoPage);
      }
      if (sliderBtn) {
        const gotosliderPage = +sliderBtn.dataset.slide;
        slider(gotosliderPage);
      }
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage,
    );
    const totalPages = Array.from({ length: numPages }, (page, i) => i + 1);
    const currentGroup = this._data.currentGroup;
    const totalGroup = Math.ceil(
      totalPages.length / this._data.paginationBtnPerPage,
    );

    const getfirstFive = function (currentGroup) {
      console.log(this);
      const start = (currentGroup - 1) * this._data.paginationBtnPerPage;
      const end = currentGroup * this._data.paginationBtnPerPage;
      // console.log(totalPages.slice(start, end));
      return totalPages.slice(start, end);
    };

    console.log(currentGroup, totalPages, totalGroup);

    const paginationBtn = function (number) {
      return `<button class="btn--inline btn--page ${curPage === number ? 'btn--inline--active' : ''}" data-page="${number}">${number}</button>`;
    };

    const paginationBtnNext = function () {
      return ` <button class="btn--inline btn--slide pagination__btn--next" data-slide="${currentGroup + 1}">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </button>`;
    };

    const paginationBtnPrevious = function () {
      return ` <button class="btn--inline btn--slide pagination__btn--prev" data-slide="${currentGroup - 1}">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      </button>`;
    };

    if (this._data.currentGroup === 1) {
      const fivePage = getfirstFive
        .call(this, this._data.currentGroup)
        .map(btn => paginationBtn(btn))
        .join('');
      const condition = totalPages.length > this._data.paginationBtnPerPage;
      return condition && fivePage + paginationBtnNext();
    } else if (this._data.currentGroup < totalGroup) {
      const firstFive = getfirstFive
        .call(this, this._data.currentGroup)
        .map(btn => paginationBtn(btn))
        .join('');

      const condition = totalPages.length > this._data.paginationBtnPerPage;

      let markup;
      return (
        condition && paginationBtnPrevious() + firstFive + paginationBtnNext()
      );
    } else if (this._data.currentGroup === totalGroup) {
      const firstFive = getfirstFive
        .call(this, this._data.currentGroup)
        .filter(page => {
          return page > 10 && page <= 15;
        })
        .map(btn => {
          return paginationBtn(btn);
        })
        .join('');

      console.log(firstFive);

      const condition = totalPages.length > this._data.paginationBtnPerPage;

      let markup;
      return condition && paginationBtnPrevious() + firstFive;
    } else {
      return '';
    }

    // const previousBtn = function () {
    //   const markup = `
    //   <button class="btn--inline pagination__btn--prev" data-page="${curPage - 1}">
    //   <svg class="search__icon">
    //     <use href="${icons}#icon-arrow-left"></use>
    //   </svg>
    //   <span>Page ${curPage - 1}</span>
    //   </button>
    //   `;
    //   return markup;
    // };

    // const nextBtn = function () {
    //   const markup = `
    //   <button class="btn--inline pagination__btn--next" data-page="${curPage + 1}">
    //   <span>Page ${curPage + 1}</span>
    //   <svg class="search__icon">
    //   <use href="${icons}#icon-arrow-right"></use>
    //   </svg>
    //   </button>
    //   `;
    //   return markup;
    // };

    // if (curPage < numPages && curPage === 1) {
    //   return nextBtn();
    // }

    // if (curPage === numPages) {
    //   return previousBtn();
    // }

    // if (curPage < numPages && curPage !== numPages) {
    //   let markup = previousBtn() + nextBtn();

    //   return markup;
    // }

    return '';
  }

  // challenge (1)
  //  display the number of pages between the pagination button

  // (1) get the total number of pages
  // (2) create a button with a condition that I will turn the numpages to and array and use it to create a button
}
