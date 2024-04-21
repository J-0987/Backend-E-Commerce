const router = require('express').Router();
const { Category, Product } = require('../../models');

// * Get all categories
router.get('/', async (req, res) => {
  try {
    const data = await Category.findAll({
      include: [Product]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// * Get a category by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await Category.findByPk(req.params.id, {
      include: [Product]
    });
    res.json(data);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// * Create a new category
router.post('/', async (req, res) => {
  try {
    const data = await Category.create(req.body);
    res.json(data);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// * Update a category by ID
router.put('/:id', async (req, res) => {
  try {
    const data = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.json(data);
  } catch (err) { 
    res.status(500).json(err);
  }
}); 

// * Delete a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const data = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    res.json(data);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
