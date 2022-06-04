import {tbodyElement} from './pageElements.js';

export const createRow = (goodNumber, goodObject) => {
    const element = `
  <tr>
    <td class="table__cell ">${goodNumber}</td>
    <td class="table__cell table__cell_left table__cell_name" data-id="${goodObject.id}">
        <span class="table__cell-id">id: ${goodObject.id}</span>${goodObject.title}</td>
    <td class="table__cell table__cell_left">${goodObject.category}</td>
    <td class="table__cell">${goodObject.units}</td>
    <td class="table__cell">${goodObject.count}</td>
    <td class="table__cell">${goodObject.price}</td>
    <td class="table__cell">${goodObject.price * goodObject.count}</td>
    <td class="table__cell table__cell_btn-wrapper">
        <button class="table__btn table__btn_pic" data-pic="img/test.jpg"></button>
        <button class="table__btn table__btn_edit"></button>
        <button class="table__btn table__btn_del"></button>
    </td>
  </tr>
    `;
    return element;
}

export const addToBody = element => {
    const body = tbodyElement;
    body.insertAdjacentHTML('beforeend', element);
}