const StorageController = (function(){



})();

const ProductController = (function(){

    const Product = function(id,name,price){
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products : [],
        selectedProduct:null,
        totalPrice:0
    }

    return{
        getProducts: function(){
            return data.products;
        },
        getData: function(){
            return data;
        },
        addProduct: function(name,price){
            let id ;
            if(data.products.length>0){
                id = data.products[data.products.length-1].id+1;

            }

            else{
                id = 0;
            }

            const newProduct = new Product(id,name,parseFloat(price));
            data.products.push(newProduct);

            return newProduct;
        },

        getTotal :function(){
            let total = 0;
            data.products.forEach(function(item){
                total += item.price;
            });

            data.totalPrice = total;
            return data.totalPrice;
        }
    }

})();

const UIController = (function(){


    const Selectors = {
        productList :"#item-list",
        addButton : '.addBtn',
        productName : '#productName',
        productPrice : '#productPrice',
        totalTL : '#total-tl',
        totalDolar : '#total-dolar'
    }
    return{
        createProductList: function(products){
            let html ='';

            products.forEach(prd =>{
                html += ` <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price}</td>
                <td class="text-right">
                    <button type="submit" class="btn btn-warning btn-sm">
                        <i class="far fa-edit"></i>
                    </button>
                </td>
                
            
            </tr>`;
            })

            document.querySelector(Selectors.productList).innerHTML = html;
        } ,
        getSelectors : function(){
            return Selectors;
        } ,

        addProduct : function(prd){
            var item = `
            <tr>
            <td>${prd.id}</td>
            <td>${prd.name}</td>
            <td>${prd.price} $</td>
            <td class="text-right">
                <button type="submit" class="btn btn-warning btn-sm">
                    <i class="far fa-edit"></i>
                </button>
            </td>
            
        
        </tr>
            `;
            document.querySelector(Selectors.productList).innerHTML += item;
        },
        clearInputs : function(){
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value= '';
        },
        showTotal: function(total){
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTL).textContent= total*8.9;
        }
    }

})();

const App = (function(ProductCtrl,UICtrl){

    const UISelectors =UIController.getSelectors();

    const loadEventListeners = function(){
        document.querySelector(UISelectors.addButton).addEventListener('click',productAddSubmit);
        
    }

    const productAddSubmit = function(e){

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName !== '' && productPrice !==''){
         const newProduct  = ProductCtrl.addProduct(productName,productPrice);
         UIController.addProduct(newProduct);

         const total = ProductCtrl.getTotal();

         UICtrl.showTotal(total);

         UIController.clearInputs();
         
        }
       
        e.preventDefault();
    }

    return {
        init:function(){
            console.log("dfghjkl");
            const products = ProductCtrl.getProducts();
            console.log(products);

            UICtrl.createProductList(products);

            loadEventListeners();

        }
    }

})(ProductController,UIController);
    
App.init();