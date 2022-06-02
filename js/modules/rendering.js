import { tbodyElement, crmTotalPrice, } from './pageElements.js';
import { createRow, addToBody } from './addElemetsToPage.js';

export const computeTotalPriceOfGoods = goods => {
    let totalPriceOfGoods = goods.reduce((total, item) => {
        if (!Number.isNaN(item.discont)) {
            return total + (item.price * item.count - item.discont);
        }
        else return total + (item.price * item.count);
    }, 0);
    crmTotalPrice.textContent = `$ ${totalPriceOfGoods}`;
};

export const renderGoods = arrayGoods => {

    const body = tbodyElement;
    body.textContent = '';

    const goods = arrayGoods;
    let goodNumber = 0;

    goods.forEach(goodObject => {
        goodNumber++;
        const element = createRow(goodNumber, goodObject);
        addToBody(element);
    });
}