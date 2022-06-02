import { computeTotalPriceOfGoods, renderGoods } from './modules/rendering.js';
import * as pageElements from './modules/pageElements.js';
import { createRow, addToBody } from './modules/addElemetsToPage.js';

let goods = [
    {
        "id": 1,
        "name": "Смартфон Xiaomi 11T 8/128GB",
        "price": 27000,
        "description": "Смартфон Xiaomi 11T – это представитель флагманской линейки, выпущенной во второй половине 2021 года. И он полностью соответствует такому позиционированию, предоставляя своим обладателям возможность пользоваться отличными камерами, ни в чем себя не ограничивать при запуске игр и других требовательных приложений.",
        "category": "mobile-phone",
        "discont": false,
        "count": 3,
        "units": "шт",
        "images": {
            "small": "img/smrtxiaomi11t-m.jpg",
            "big": "img/smrtxiaomi11t-b.jpg"
        }
    },
    {
        "id": 2,
        "name": "Радиоуправляемый автомобиль Cheetan",
        "price": 4000,
        "description": "Внедорожник на дистанционном управлении. Скорость 25км/ч. Возраст 7 - 14 лет",
        "category": "toys",
        "discont": 5,
        "count": 1,
        "units": "шт",
        "images": {
            "small": "img/cheetancar-m.jpg",
            "big": "img/cheetancar-b.jpg"
        }
    },
    {
        "id": 3,
        "name": "ТВ приставка MECOOL KI",
        "price": 12400,
        "description": "Всего лишь один шаг сделает ваш телевизор умным, Быстрый и умный MECOOL KI PRO, прекрасно спроектированный, сочетает в себе прочный процессор Cortex-A53 с чипом Amlogic S905D",
        "category": "tv-box",
        "discont": 15,
        "count": 4,
        "units": "шт",
        "images": {
            "small": "img/tvboxmecool-m.jpg",
            "big": "img/tvboxmecool-b.jpg"
        }
    },
    {
        "id": 4,
        "name": "Витая пара PROConnect 01-0043-3-25",
        "price": 22,
        "description": "Витая пара Proconnect 01-0043-3-25 является сетевым кабелем с 4 парами проводов типа UTP, в качестве проводника в которых используется алюминий, плакированный медью CCA. Такая неэкранированная витая пара с одножильными проводами диаметром 0.50 мм широко применяется в процессе сетевых монтажных работ. С ее помощью вы сможете обеспечить развертывание локальной сети в домашних условиях или на предприятии, объединить все необходимое вам оборудование в единую сеть.",
        "category": "cables",
        "discont": false,
        "count": 420,
        "units": "v",
        "images": {
            "small": "img/lan_proconnect43-3-25.jpg",
            "big": "img/lan_proconnect43-3-25-b.jpg"
        }
    }
];

{
    const addButton = pageElements.addButtonElement;
    addButton.addEventListener('click', () => {
        const overlay = pageElements.overlayElement;
        overlay.classList.add('active');
        const vendorCode = Math.round(Math.random() * (10 ** 14));
        pageElements.vendorCode_Id.textContent = vendorCode;
    });

    const closeModal = () => {
        const overlay = pageElements.overlayElement;
        overlay.classList.remove('active');
    };

    const closeButton = pageElements.modal__close;
    closeButton.addEventListener('click', () => {
        closeModal();
    });

    const tbody = pageElements.tbodyElement;
    tbody.addEventListener('click', e => {
        const target = e.target;

        if (target.classList.contains('table__btn_del')) {
            const parentTr = target.closest('tr');
            const id = parentTr.children[1].getAttribute('data-id');
            goods = goods.filter(item => item.id != id);
            parentTr.remove();
            computeTotalPriceOfGoods(goods);
            renderGoods(goods);
        }

        if (target.classList.contains('table__btn_pic')) {
            const top = (screen.height - 600) / 2;
            const left = (screen.width - 800) / 2;
            const url = target.getAttribute('data-pic');
            var newWindow = window.open('about:blank','',`width=800,height=600,top=${top},left=${left}`);
            newWindow.document.write('<img src="' + url + '" />');
        }
    });

    const modalForm = pageElements.modal__form;
    modalForm.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const product = Object.fromEntries(formData);
        if (typeof product.discont === 'undefined')
            product.discont = 0;
        else
            product.discont = product.discount_count;

        product.id = pageElements.vendorCode_Id.textContent;
        const newRow = createRow(goods.length + 1, product);
        addToBody(newRow);
        goods.push(product);
        computeTotalPriceOfGoods(goods);
        closeModal();
    });

    modalForm.discount.addEventListener('click', () => {
        modalForm.discount_count.toggleAttribute("disabled");
        modalForm.discount_count.value = '';
    });

    const computeCurrentModalTotalPrice = () => {
        if (!Number.isNaN(modalForm.count.value) && !Number.isNaN(modalForm.price.value)) {
            let totalPrice = modalForm.count.value * modalForm.price.value;
            if (!Number.isNaN(modalForm.discount_count.value))
                totalPrice -= modalForm.discount_count.value;

            modalForm.total.textContent = totalPrice;
        }
    };

    modalForm.count.addEventListener('change', computeCurrentModalTotalPrice);
    modalForm.price.addEventListener('change', computeCurrentModalTotalPrice);
    modalForm.discount_count.addEventListener('change', computeCurrentModalTotalPrice);

    const init = () => {
        renderGoods(goods);
        computeTotalPriceOfGoods(goods);
    }
    window.initCRM = init;
}
