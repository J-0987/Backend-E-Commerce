const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// * Get all products
router.get('/', (req, res) => {
  // find all products
 Product.findAll({
    include: [
      Category,
      {
        model: Tag,
        through: ProductTag
      }
    ]
  })
  .then((products) => res.json(products))
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

// * Get product by id
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
try {
  const data = await Product.findByPk(req.params.id, {
    include: [
      Category,
      {
        model: Tag,
        through: ProductTag
      }
    ]
  });
  res.json(data);
}
catch (err) {
  res.status(500).json(err);
}
});


// * Create a new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});



  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

  

// * Update product data
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// * Delete one product by its `id` value

router.delete('/:id', async (req, res) => {
try {
  const data = await Product.destroy({
    where: {
      id: req.params.id
    }
  });
  if (!data) {
    res.status(404).json({ message: 'No product found with this id!' });
    return;
  }
  res.json(data);
}
catch (err) {
  res.status(500).json(err);
}

 
});

module.exports = router;
