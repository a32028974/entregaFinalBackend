import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'express-handlebars';

import productsRouter from './src/routes/api/products.router.js';
import cartsRouter from './src/routes/api/carts.router.js';
import viewsRouter from './src/routes/views.router.js';

const app = express();
const PORT = 3000;

// 🌐 Socket Server
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
const io = new Server(httpServer);

// 📦 MongoDB Atlas connection
mongoose.connect('mongodb+srv://juan:juan6980@cluster0.srhijaz.mongodb.net/entregaFinalBackend?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

// 📦 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛣️ Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'src', 'public')));

// 🎨 Handlebars (sin @handlebars/allow-prototype-access)
app.engine('handlebars', handlebars.engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// 🚏 Routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// 🔌 WebSocket básico (opcional)
io.on('connection', socket => {
  console.log('Nuevo cliente conectado');
});
