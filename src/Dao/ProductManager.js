import fs from "fs";

export class ProductManager {
    #path = "";
    
    constructor(rutaArchivo) {
        this.#path = rutaArchivo;
        this.idInicial = 1; 
        this.initId();
    }


    async initId() {
        const products = await this.getProducts();
        if (products.length > 0) {
            
            this.idInicial = Math.max(...products.map(p => p.id)) + 1;
        }
    }
    
    async addProduct(product) {
        const { title, description, price, thumbnails, code, stock, category, status = true } = product;

        if (!title || !description || !price || !thumbnails || !code || !stock || !category || !Array.isArray(thumbnails)) {
            throw new Error("Todos los campos son obligatorios y thumbnails debe tener la ruta correcta donde está alojada la imagen");
        }

        const products = await this.getProducts();

        const codeExiste = products.some((p) => p.code === code);
        if (codeExiste) {
            throw new Error(`El producto con el código ${code} ya existe`);
        }

        const newProduct = {
            id: this.idInicial,
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status
        };

        products.push(newProduct);

        
        this.idInicial++;

        await this.saveProducts(products);
        io.emit("updateProducts", products);
    }

    async getProducts() {
        if (fs.existsSync(this.#path)) {
            return JSON.parse(await fs.promises.readFile(this.#path, { encoding: "utf-8" }));
        } else {
            return [];
        }
    }

    async saveProducts(products) {
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2));
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find((p) => p.id === id);
        if (!product) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const productIndex = products.findIndex((p) => p.id === id);

        if (productIndex === -1) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }

        const updatedProduct = { ...products[productIndex], ...updatedFields, id };

        products[productIndex] = updatedProduct;

        await this.saveProducts(products);
        return updatedProduct;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);

        if (index === -1) {
            throw new Error(`Producto con Id ${id} no encontrado`);
        }

        products.splice(index, 1);
        await this.saveProducts(products);
        io.emit("updateProducts", products);
        return `Producto con id ${id} eliminado exitosamente`;
    }
}
