// ✅ 1. RUTA /carts/:cid - en carts.router.js

import { Router } from 'express';
import { CartModel } from '../../models/cart.model.js';

const router = Router();

// Mostrar el carrito con populate y render Bootstrap
router.get('/:cid/view', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await CartModel.findById(cartId).populate('products.product').lean();

    if (!cart) return res.status(404).send('Carrito no encontrado');

    // Calcular total
    const total = cart.products.reduce((sum, p) => sum + (p.product.price * p.quantity), 0);

    res.render('cart', { cart, total });
  } catch (err) {
    console.error('Error al mostrar el carrito:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// Vaciar carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    cart.products = [];
    await cart.save();
    res.send({ status: 'success', message: 'Carrito vaciado' });
  } catch (err) {
    console.error('Error al vaciar el carrito:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// Eliminar producto específico
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.send({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (err) {
    console.error('Error al eliminar producto del carrito:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// Actualizar cantidad de producto (sumar o restar)
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).send('Producto no encontrado en el carrito');

    // Sumar/restar cantidad
    item.quantity += quantity;

    // Validar que no quede en menos de 1
    if (item.quantity <= 0) {
      cart.products = cart.products.filter(p => p.product.toString() !== pid);
    }

    await cart.save();
    res.send({ status: 'success', message: 'Cantidad actualizada' });
  } catch (err) {
    console.error('Error al actualizar cantidad:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// Confirmar compra: restar stock y vaciar carrito
router.post('/:cid/purchase', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).populate('products.product');

    if (!cart) return res.status(404).send({ message: 'Carrito no encontrado' });

    for (const item of cart.products) {
      const product = item.product;
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      } else {
        return res.status(400).send({ message: `Stock insuficiente para ${product.title}` });
      }
    }

    cart.products = [];
    await cart.save();

    res.send({ message: '✅ Compra realizada con éxito' });
  } catch (err) {
    console.error('Error en la compra:', err);
    res.status(500).send({ message: '❌ Error al procesar la compra' });
  }
});


export default router;
