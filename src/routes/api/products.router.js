import { Router } from 'express';
import { ProductModel } from '../../models/product.model.js'; // asumimos que este archivo ya existe

const router = Router();

// GET /api/products con paginación, filtro, ordenamiento
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Filtro por categoría o disponibilidad
    let filter = {};
    if (query) {
      filter = {
        $or: [
          { category: { $regex: query, $options: 'i' } },
          { status: query.toLowerCase() === 'true' } // disponibilidad: true o false
        ]
      };
    }

    // Ordenamiento por precio
    let sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    if (sort === 'desc') sortOption.price = -1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption
    };

    const result = await ProductModel.paginate(filter, options);

    // Construimos los links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    res.send({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null
    });
  } catch (err) {
    res.status(500).send({ status: 'error', message: err.message });
  }
});

export default router;
