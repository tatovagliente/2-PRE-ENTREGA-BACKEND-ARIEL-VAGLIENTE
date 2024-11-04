import fs from "fs";

export class CartManager {
    #path = "";
    constructor(rutaArchivoCart) {
        this.#path = rutaArchivoCart;
        this.idInicial = 1;
    }

    
    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: this.idInicial,
            products: []
        };
        carts.push(newCart);
        this.idInicial++;
        await this.saveCarts(carts);
        return newCart;
    }

    
    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.#path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.log("Error leyendo el archivo:", error);
            return [];
        }
    }

    
    async saveCarts(carts) {
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
    }

    
    async getCartById(cartId) {
        const carts = await this.getCarts();
        const cart = carts.find((c) => c.id === cartId);
        if (cart) {
            return cart; 
        } else {
            return null; 
        }
    }

    
    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find((c) => c.id === cartId);
        
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const existingProduct = cart.products.find((p) => p.product === productId);
    
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
    
        await this.saveCarts(carts);
        return cart;
    }
}
