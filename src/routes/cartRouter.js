import { Router } from 'express';
import { CartManager } from '../Dao/CartManager.js';

const router = Router();
const cartManager = new CartManager('./src/Data/carts.json');


router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).send(newCart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(Number(cid));
        if (cart) {
            res.status(200).send(cart);
        } else {
            res.status(404).send({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(Number(cid), Number(pid));
        res.status(200).send(`Producto con id ${pid} agregado al carrito con id ${cid}`);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

export default router;
