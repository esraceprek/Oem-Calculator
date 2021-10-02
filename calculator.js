const StorageController = (function () {



})();

const ProductController = (function () {

    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: [],
        selectedProduct: null,
        totalPrice: 0
    }

    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },

        getProductById: function (id) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                }
            })
            return product;
        },

        setCurrentProduct: function (product) {

            data.selectedProduct = product;
        },

        getCurrentProduct: function () {

            return data.selectedProduct;

        },
        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;

            }

            else {
                id = 0;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);

            return newProduct;
        },

        updatedProduct: function (name, price) {

            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = price;
                    product = prd;
                }
            });
            return product;
        },

        getTotal: function () {
            let total = 0;
            data.products.forEach(function (item) {
                total += item.price;
            });

            data.totalPrice = total;
            return data.totalPrice;
        }
    }

})();

const UIController = (function () {


    const Selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: '.addBtn',
        updateButton: '.updateBtn',
        cancelButton: '.cancelBtn',
        deleteButton: '.deleteBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar'
    }
    return {
        createProductList: function (products) {
            let html = '';

            products.forEach(prd => {
                html += ` <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price}</td>
                <td class="text-right">
               <i class="far fa-edit edit-product"></i>
                    
                </td>
                
            
            </tr>`;
            })

            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },

        addProduct: function (prd) {
            var item = `
            <tr>
            <td>${prd.id}</td>
            <td>${prd.name}</td>
            <td>${prd.price} $</td>
            <td class="text-right">
            <i class="far fa-edit edit-product"></i>
                
            </td>
            
        
        </tr>
            `;
            document.querySelector(Selectors.productList).innerHTML += item;
        },

        updatedProduct: function(prd){
        let updatedItem= null;

        let items = document.querySelectorAll(Selectors.productListItems);
        items.forEach(function(item){
        
            if(item.classList.contains('bg-warning')){
             item.children[1].textContent = prd.name;
             item.children[2].textContent = prd.price + '$';
             updatedItem = item;
            }
        });
        },
        clearInputs: function () {
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },
        showTotal: function (total) {
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTL).textContent = total * 8.9;
        },

        addProductToForm: function () {

            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;

            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },

        addingState: function () {

            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';

        },

        editState: function (tr) {
            const parent = tr.parentNode;

            for (let i = 0; i < parent.children.length; i++) {
                parent.children[i].classList.remove('bg-warning');
            }
            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';


        }
    }




})();

const App = (function (ProductCtrl, UICtrl) {

    const UISelectors = UIController.getSelectors();

    const loadEventListeners = function () {
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);


        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

        document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit);
    }

    const productAddSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            const newProduct = ProductCtrl.addProduct(productName, productPrice);
            UIController.addProduct(newProduct);

            const total = ProductCtrl.getTotal();

            UICtrl.showTotal(total);

            UIController.clearInputs();

        }

        e.preventDefault();
    }

    const productEditClick = function (e) {

        if (e.target.classList.contains('edit-product')) {

            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            const product = ProductCtrl.getProductById(id);

            ProductCtrl.setCurrentProduct(product);

            UICtrl.addProductToForm();

            UICtrl.editState(e.target.parentNode.parentNode);
        }
        e.preventDefault();
    }

    const editProductSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            const updatedProduct = ProductCtrl.updatedProduct(productName, productPrice);
        }

       let item = UICtrl.updatedProduct(updatedProduct);
        e.preventDefault();
    }

    return {
        init: function () {
            console.log("dfghjkl");

            UICtrl.addingState();
            const products = ProductCtrl.getProducts();
            console.log(products);

            UICtrl.createProductList(products);

            loadEventListeners();

        }
    }

})(ProductController, UIController);

App.init();