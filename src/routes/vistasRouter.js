import { Router } from 'express';
import __dirname from '../utils.js';
import { ProductManager } from '../Dao/ProductManager.js';


const router = Router()
const productManager = new ProductManager('./src/Data/products.json');

router.get("/", async (req, res)=> {
    let allProducts= await productManager.getProducts()
    res.render("home", {
        titulo: "Productos",
        products: allProducts
    }) 
})

router.get("/realtimeproducts", async (req, res)=>{
    let allProducts= await productManager.getProducts()
    res.render("realtimeproducts", {
        titulo: "Productos en tiempo real",
        products: allProducts
        })
})

export default router;