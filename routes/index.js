const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// It's important to note that this middleware function does not specify a specific route path. Therefore, it will be executed for any incoming request that matches the router's base path. This can be useful for handling cases where none of the defined routes match the requested URL.ß
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

module.exports = router;