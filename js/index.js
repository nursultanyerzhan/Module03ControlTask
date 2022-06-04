import { computeTotalPriceOfGoods, renderGoods } from './modules/rendering.js';
import * as pageElements from './modules/pageElements.js';
import { createRow, addToBody } from './modules/addElemetsToPage.js';

let goods = [];
const backendUrl = 'https://evening-forest-92663.herokuapp.com';
// const backendUrl = 'http://localhost:3000';
{
    const initGoods = () => {
        fetch(`${backendUrl}/api/goods`)
            .then(response => response.json())
            .then(data => {
                goods = data;
                renderGoods(goods);
                computeTotalPriceOfGoods(goods);
            }).catch((err) => console.log(err));
    };

    let selectedImageAddBase64 = '';
    let selectedImageChangeBase64 = '';

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

    const closeDeleteModal = () => {
        const overlay = pageElements.overlayModalDeleteElement;
        overlay.classList.remove('active');
    };

    const closeEditModal = () => {
        const overlay = pageElements.overlayModalEditElement;
        overlay.classList.remove('active');
        const img_wrapper = document.querySelector('#img_wrapperEdit');
        img_wrapper.textContent = '';
    };

    const closeButton = pageElements.modal__close;
    closeButton.addEventListener('click', () => {
        closeModal();
        const img_wrapper = document.querySelector('#img_wrapper');
        img_wrapper.textContent = '';
    });

    const closeModalError = pageElements.errorModal__close;
    closeModalError.addEventListener('click', () => {
        pageElements.errorModal.style.display = 'none';
    });

    const closemodalDelete = pageElements.modalDelete__close;
    closemodalDelete.addEventListener('click', () => {
        closeDeleteModal();
    });

    const closemodalEdit = pageElements.modalEdit__close;
    closemodalEdit.addEventListener('click', () => {
        closeEditModal();
    });

    const deleteGoodsForm = document.querySelector('#deleteGoodsForm');
    deleteGoodsForm.addEventListener('submit', e => {
        e.preventDefault();

        const parent = e.target.closest('.overlay');
        const dataId = parent.getAttribute('data-id');

        fetch(`${backendUrl}/api/goods/${dataId}`, {
            method: 'DELETE',
        })
            .then(resp => {
                if (resp.status === 200) {
                    console.log(`deleted ${dataId}`);
                    goods = goods.filter(item => item.id != dataId);
                    computeTotalPriceOfGoods(goods);
                    renderGoods(goods);
                }
            }).catch((err) => console.log(err))

        closeDeleteModal();
    });

    const tbody = pageElements.tbodyElement;
    tbody.addEventListener('click', e => {
        const target = e.target;

        if (target.classList.contains('table__btn_del')) {
            const parentTr = target.closest('tr');
            const id = parentTr.children[1].getAttribute('data-id');

            const overlay = pageElements.overlayModalDeleteElement;
            overlay.classList.add('active');
            overlay.setAttribute('data-id', id);

        }

        if (target.classList.contains('table__btn_pic')) {
            const top = (screen.height - 600) / 2;
            const left = (screen.width - 800) / 2;
            const url = target.getAttribute('data-pic');
            var newWindow = window.open('about:blank', '', `width=800,height=600,top=${top},left=${left}`);
            newWindow.document.write('<img src="' + url + '" />');
        }

        if (target.classList.contains('table__btn_edit')) {
            const parentTr = target.closest('tr');
            const id = parentTr.children[1].getAttribute('data-id');

            const overlay = pageElements.overlayModalEditElement;
            overlay.classList.add('active');
            overlay.setAttribute('data-id', id);

            fetch(`${backendUrl}/api/goods/${id}`)
                .then(resp =>
                    resp.json()
                )
                .then(data => {
                    const editGoodsForm = document.querySelector('#editGoodsForm');
                    editGoodsForm.id.value = data.id;
                    editGoodsForm.title.value = data.title;
                    editGoodsForm.category.value = data.category;
                    editGoodsForm.description.value = data.description;
                    editGoodsForm.units.value = data.units;
                    editGoodsForm.count.value = data.count;
                    editGoodsForm.price.value = data.price;

                    if (data.discount > 0) {
                        editGoodsForm.discount_count.removeAttribute('disabled');
                        editGoodsForm.discount_count.value = data.discount;
                        editGoodsForm.discount.setAttribute('checked', 'checked');
                    }
                    else {
                        editGoodsForm.discount_count.setAttribute('disabled', 'disabled');
                        editGoodsForm.discount_count.value = '';
                        editGoodsForm.discount.removeAttribute('checked');
                    }

                    editGoodsForm.discount.addEventListener('click', () => {
                        editGoodsForm.discount_count.toggleAttribute("disabled");
                    });

                    editGoodsForm.addEventListener('submit', e => {
                        e.preventDefault();
                        const changedObject = Object.fromEntries(new FormData(editGoodsForm));
                        changedObject.discount = changedObject.discount_count;
                        changedObject.image = selectedImageChangeBase64;

                        fetch(`${backendUrl}/api/goods/${id}`, {
                            method: 'PATCH',
                            body: JSON.stringify(changedObject)
                        })
                            .then(resp => {
                                if (resp.status === 200 || resp.status === 201) {
                                    initGoods();
                                    closeEditModal();
                                }

                            })
                            .catch((err) => pageElements.errorModal.style.display = 'block');
                    })
                })
        }
    });

    const modalForm = pageElements.modal__form;
    modalForm.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const product = Object.fromEntries(formData);
        if (typeof product.discount === 'undefined')
            product.discount = 0;
        else
            product.discount = product.discount_count;

        product.id = pageElements.vendorCode_Id.textContent;
        product.discount = product.discount_count;
        product.image = selectedImageAddBase64;

        fetch(`${backendUrl}/api/goods`, {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                closeModal();
                initGoods();
            })
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

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener('loadend', () => {
            resolve(reader.result);
        });

        reader.addEventListener('error', err => {
            reject(err);
        });

        reader.readAsDataURL(file);
    });

    const imageFile = document.querySelector('#imageAdd');
    console.log(imageFile);
    imageFile.addEventListener('change', async () => {
        if (imageFile.files.length > 0) {
            const imgWrapper = document.querySelector('#img_wrapper');
            if (imageFile.files[0].size > 1000000) {
                imgWrapper.textContent = 'Изображение не должно превышать размер 1 Мб';
                imgWrapper.style.color = 'red';
            }
            else {
                imgWrapper.textContent = '';
                const img = document.createElement('img');
                const result = await toBase64(imageFile.files[0]);

                selectedImageAddBase64 = result;
                img.src = result;
                imgWrapper.append(img);
            }
        }
    });

    const imageFileEdit = document.querySelector('#imageEdit');
    console.log(typeof imageFileEdit);
    imageFileEdit.addEventListener('change', async () => {
        if (imageFileEdit.files.length > 0) {
            const imgWrapper = document.querySelector('#img_wrapperEdit');
            if (imageFileEdit.files[0].size > 1000000) {
                imgWrapper.textContent = 'Изображение не должно превышать размер 1 Мб';
                imgWrapper.style.color = 'red';
            }
            else {
                imgWrapper.textContent = '';
                const img = document.createElement('img');
                const result = await toBase64(imageFileEdit.files[0]);

                selectedImageChangeBase64 = result;
                img.src = result;
                imgWrapper.append(img);
                console.log(img);
            }
        }
    });

    modalForm.count.addEventListener('change', computeCurrentModalTotalPrice);
    modalForm.price.addEventListener('change', computeCurrentModalTotalPrice);
    modalForm.discount_count.addEventListener('change', computeCurrentModalTotalPrice);

    const panel__input = document.querySelector('.panel__input');
    panel__input.addEventListener('input', () => {
        setTimeout(() => {
            fetch(`${backendUrl}/api/goods?search=${panel__input.value}`)
                .then(resp => resp.json())
                .then(data => {
                    goods = data;
                    renderGoods(goods);
                    computeTotalPriceOfGoods(goods);
                }).catch((err) => console.log(err));
            console.log();
        }, 300);
    });

    const init = () => {
        fetch(`${backendUrl}/api/category`).then(resp => resp.json()).then(list => {
            const categoryList = document.querySelector('#category-list');

            list.forEach(element => {
                const option = document.createElement('option');
                option.value = element;
                categoryList.append(option);
            });
        }).catch((err) => console.log(err));
        initGoods();
    }
    window.initCRM = init;
}
