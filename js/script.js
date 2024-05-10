let cartItems = []; // Array para almacenar los elementos del carrito

// Función para agregar un producto al carrito
function addToCart(productName, price) {
    // Busca si el producto ya está en el carrito
    const existingItem = cartItems.find(item => item.name === productName);

    if (existingItem) {
        // Si el producto ya está en el carrito, sumar la cantidad
        existingItem.quantity++;
    } else {
        // Si el producto no está en el carrito, agregarlo con cantidad de 1
        cartItems.push({ name: productName, price: price, quantity: 1 });
    }

    updateCart(); // Actualiza la visualización del carrito
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cartItems.splice(index, 1); // Elimina el producto del array del carrito en el índice dado
    updateCart(); // Actualiza la visualización del carrito
}

// Función para actualizar la cantidad de un producto en el carrito
function updateQuantity(index, newQuantity) {
    cartItems[index].quantity = newQuantity; // Actualiza la cantidad del producto en el carrito
    updateCart(); // Actualiza la visualización del carrito
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
        listItem.textContent = `${item.name} - $${item.price} para ${item.quantity} persona  `;
            if (item.quantity > 1) {
                listItem.textContent = `${item.name} - $${item.price} para ${item.quantity} personas  `;
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
    alert('Muchas gracias por tu compra viajero!');
    cartItems = [];
    updateCart();
}

// Función para mostrar u ocultar el carrito
function toggleCart() {
    const cart = document.getElementById('cart');
    cart.style.display = cart.style.display === 'block' ? 'none' : 'block';
} 