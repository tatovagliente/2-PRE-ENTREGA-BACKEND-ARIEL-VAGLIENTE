const socket = io();
const divProducts = document.querySelector("#products");


socket.on("newProduct", (product) => {
    const liProduct = document.createElement("li");
    liProduct.innerHTML = `
        <h2>PRODUCTO: ${product.title}</h2>
        <h3>DESCRIPCIÓN: ${product.description}</h3>
        <p>PRECIO: $${product.price}</p>
        <p>CODIGO: ${product.code}</p>
        <p>STOCK: ${product.stock}</p>
    `;
    divProducts.appendChild(liProduct);
});


socket.on("deleteProduct", (productId) => {
    const productElements = divProducts.getElementsByTagName("li");
    for (let productElement of productElements) {
        if (productElement.innerHTML.includes(`CODIGO: ${productId}`)) {
            divProducts.removeChild(productElement);
            break;
        }
    }
});

