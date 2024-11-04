import express from 'express';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import {engine} from 'express-handlebars';
import * as path from "path";
import __dirname from './utils.js';
import vistasRouter from './routes/vistasRouter.js';
import {Server} from 'socket.io';


const app = express();
const PORT = 8080;
let io

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

app.use("/", express.static(__dirname + "/public"))


app.use('/', vistasRouter)
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


const server=app.listen(PORT, () => {
    console.log(`Server up en puerto ${PORT} con Express`);
});

io=new Server(server)

