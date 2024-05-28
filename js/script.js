let cartItems = []; // Array para almacenar los elementos del carrito

// Cargar el carrito desde el almacenamiento local al cargar la página
window.onload = function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCart();
    }
}
// Añadir eventos a los botones de agregar al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const product = button.parentElement.querySelector('h3').textContent;
            const price = parseFloat(button.parentElement.querySelector('p').textContent.replace('$', ''));
            addToCart(product, price);
        });
    });

// Añadir evento al botón de mostrar/ocultar carrito
    document.querySelector('.cart-toggle-btn').addEventListener('click', toggleCart);

// Añadir evento al botón de finalizar compra
    document.getElementById('checkout-btn').addEventListener('click', checkout);



// Función para guardar el carrito en el almacenamiento local
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Obtener los datos de los productos mediante fetch
fetch('products.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener los datos de los productos');
        }
        return response.json();
    })
    .then(products => {
        // Renderizar los productos en la página
        renderProducts(products);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Función para renderizar los productos
function renderProducts(products) {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('products');
        
        const productTitle = document.createElement('h3');
        productTitle.textContent = product.name;
        
        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.name;
        
        const productPrice = document.createElement('p');
        productPrice.textContent = `$${product.price}`;
        
        const addButton = document.createElement('button');
        addButton.classList.add('add-to-cart-btn');
        addButton.textContent = 'Agregar al carrito';
        addButton.addEventListener('click', () => addToCart(product.name, product.price));
        
        productCard.appendChild(productTitle);
        productCard.appendChild(productImage);
        productCard.appendChild(productPrice);
        productCard.appendChild(addButton);
        
        productList.appendChild(productCard);
    });
}

// Función para agregar un producto al carrito
function addToCart(productName, price) {
    const existingItemIndex = cartItems.findIndex(item => item.name === productName);
    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity++;
    } else {
        cartItems.push({ name: productName, price: price, quantity: 1 });
    }
    updateCart();
    saveCartToLocalStorage();
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCart();
    saveCartToLocalStorage();
}

// Función para actualizar la cantidad de un producto en el carrito
function updateQuantity(index, newQuantity) {
    cartItems[index].quantity = newQuantity;
    updateCart();
    saveCartToLocalStorage();
}


// Función para actualizar la visualización del carrito
function updateCart() {
    const cartList = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');

    cartList.innerHTML = ''; // Borra la lista actual de elementos del carrito

    let total = 0;

    // Agrega cada elemento del carrito a la lista
    cartItems.forEach((item, index) => {
        const listItem = document.createElement('li');
        
        // Muestra el nombre, precio y cantidad del producto en el carrito
        listItem.textContent = `${item.name} - $${item.price} por persona, ${item.quantity} persona  `;
            if (item.quantity > 1) {
                listItem.textContent = `${item.name} - $${item.price} por persona, ${item.quantity} personas  `;
            }
        
        // Crea botones para sumar y restar la cantidad del producto
        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.addEventListener('click', () => updateQuantity(index, item.quantity + 1));

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.addEventListener('click', () => {
            if (item.quantity > 1) {
                updateQuantity(index, item.quantity - 1);
            } else {
                removeFromCart(index);
            }
        });
        
        // Agrega los botones al elemento de la lista
        listItem.appendChild(decreaseButton);
        listItem.appendChild(increaseButton);
        
        // Agrega el elemento de la lista al carrito
        cartList.appendChild(listItem);

        total += item.price * item.quantity;
    });

    totalElement.textContent = `Total: $${total.toFixed(2)}`; // Muestra el total de la compra
}

// Función para finalizar la compra
function checkout() {
    if (cartItems.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'El carrito está vacío',
            text: 'Si no ponés nada en el carrito va a estar medio dificil comprar algo.',
            confirmButtonText: 'Aceptar'
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: '¡Compra realizada!',
            text: '¡Muchas gracias por tu compra!',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            cartItems = [];
            updateCart();
            saveCartToLocalStorage();
        });
    }
}

// Función para mostrar u ocultar el carrito
function toggleCart() {
    const cart = document.getElementById('cart');
    cart.style.display = cart.style.display === 'block' ? 'none' : 'block';
} 