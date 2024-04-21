// Import necessary modules and models
const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');



// The `/api/tags` endpoint


// * Get all tags
router.get('/', (req, res) => {

  Tag.findAll({
    include: [
      Product,
      {
        model: Product,
        through: ProductTag
      }
    ]
  })
    .then((tags) => {
      res.status(200).json(tags);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});


  // * Get tag by id
router.get('/:id', async (req, res) => {

  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        Product,
        {
          model: Product,
          through: ProductTag
        }
      ]
    });
    res.status(200).json(tag);
  }
  catch (err) {
    res.status(400).json(err);
  }

});

// * Create a new tag
router.post('/',async (req, res) => {
  // create a new tag
  try {
    const tag = await Tag.create(req.body);
    res.status(200).json(tag);
  }
  catch (err) {
    res.status(400).json(err);
  }

});

// * Update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tag = Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(tag);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

// * Delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tag = Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(tag);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
