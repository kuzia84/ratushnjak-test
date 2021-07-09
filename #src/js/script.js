function testWebP(callback) {
  var webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src =
    "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector("body").classList.add("webp");
  } else {
    document.querySelector("body").classList.add("no-webp");
  }
});

const modalForm = document.querySelector(".modal__content"),
  mainForm = document.querySelector(".modal-form"),
  addForm = document.querySelector(".add-form"),
  btnSubmit = document.getElementById("btn-submit"),
  listAddInputList = document.querySelectorAll(".list-add__input"),
  productList = document.querySelector(".product__list"),
  modalSuccess = document.querySelector(".modal__success"),
  modalFailed = document.querySelector(".modal__failed"),
  btnBack = document.getElementById("btn-back"),
  btnRepay = document.getElementById("btn-repay");

const setProductsList = (data) =>
  localStorage.setItem("products", JSON.stringify(data));

const getProductsList = () => JSON.parse(localStorage.getItem("products"));

const clearProductsList = () => localStorage.removeItem("products");

const createProductsData = (num) => {
  const productsData = [];
  for (let i = 0; i < num; i++) {
    const product = { id: +i + 1 };
    productsData.push(product);
  }
  setProductsList(productsData);
  renderNewProducts(productsData);
};

function renderNewProducts(array) {
  productList.textContent = "";
  array.forEach((item) => {
    const product = document.createElement("li");
    product.classList.add("product__item");
    product.dataset.productId = item.id;
    product.innerHTML = `
      <div class="product__top">
          <div class="product__title">Product ${item.id}</div>
          <button class="product__remove" data-removeId="${item.id}"></button>
      </div>
      <div class="product__description desc-product">
          <div class="desc-product__item">
              <label for="product${item.id}-keyword" class="desc-product__label">
                  Enter main keyword for the product
              </label>
              <input type="text" class="desc-product__input" id="product${item.id}-keyword"
                  placeholder="for example, sylicon wine cup">
          </div>
          <div class="desc-product__item">
              <label for="product${item.id}-link" class="desc-product__label">
                  Enter link to the similar product as a reference
              </label>
              <input type="text" class="desc-product__input" id="product${item.id}-link"
                  placeholder="https://...">
          </div>
      </div>
    `;
    productList.append(product);
  });
}

const totalPrice = {
  1: 24.99,
  2: 44,
  3: 60,
  4: 72,
  5: 80,
};

const toggleProductsRemovable = () => {
  const productsNumber = getProductsList().length;
  if (productsNumber > 1) productList.classList.add("removable-products");
  if (productsNumber < 2) productList.classList.remove("removable-products");
};

const removeProduct = (id) => {
  const productsData = getProductsList();
  const newProductsData = productsData.filter((item) => item.id !== +id);
  setProductsList(newProductsData);
  renderNewProducts(newProductsData);
  setNewPrice();
  toggleProductsRemovable();
};

const setNewPrice = () => {
  const productsNumber = getProductsList().length;
  btnSubmit.textContent = `Submit and Pay ${totalPrice[productsNumber]} USD`;
};

const checkStatus = () => {
  if (modalSuccess.classList.contains("active")) {
    window.location.hash = "paymentsuccess";
  }
  if (modalFailed.classList.contains("active")) {
    window.location.hash = "paymenterror";
  }
};

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

modalForm.addEventListener("click", (e) => {
  const target = e.target;

  if (target.matches("#show-add-products")) {
    clearProductsList();
    mainForm.classList.add("hidden");
    addForm.classList.add("active");
  }

  if (target.matches("#add-products")) {
    listAddInputList.forEach((item) => {
      if (item.checked) {
        createProductsData(item.value);
        toggleProductsRemovable();
      }
    });
    mainForm.classList.remove("hidden");
    addForm.classList.remove("active");
    setNewPrice();
  }

  if (target.matches(".product__remove")) {
    removeProduct(target.dataset.removeid);
  }

  if (target.matches("#btn-submit")) {
    const oldcontent = btnSubmit.textContent;
    btnSubmit.innerHTML = `<div class="spiner"></div>`;
    setTimeout(() => {
      btnSubmit.textContent = oldcontent;
      mainForm.classList.add("hidden");
      // modalFailed.classList.add("active");
      modalSuccess.classList.add("active");
      checkStatus();
    }, 2000);
  }
});
