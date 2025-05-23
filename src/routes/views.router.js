import { Router } from 'express';
import { ProductModel } from '../models/product.model.js';

const router = Router();

router.get('/products', async (req, res) => { 
  const { limit = 10, page = 1, sort, query } = req.query;

  let filter = {};
  if (query) {
    filter = {
      $or: [
        { category: { $regex: query, $options: 'i' } },
        { status: query.toLowerCase() === 'true' }
      ]
    };
  }

  let sortOption = {};
  if (sort === 'asc') sortOption.price = 1;
  if (sort === 'desc') sortOption.price = -1;

  const result = await ProductModel.paginate(filter, {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sortOption
  });

  console.log(result.docs);

  res.render('products', {
    payload: result.docs,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
    nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
  });
});

// 👇 Esta línea va afuera del bloque router
export default router;
