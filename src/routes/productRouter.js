import { Router } from 'express';
import { ProductManager } from '../Dao/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/Data/products.json');



router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.status(200).send(products);
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(Number(pid));
        res.status(200).send(product);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
    const newProduct = { title, description, code, price, status, stock, category, thumbnails };
    try {
        await productManager.addProduct(newProduct);
        io.emit("newProduct", newProduct)
        res.status(201).send("Producto agregado exitosamente");
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(Number(pid), updatedFields);
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(Number(pid));
        io.emit("deleteProduct", Number(pid));
        res.status(200).send(`Producto con id ${pid} eliminado`);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

export default router;
