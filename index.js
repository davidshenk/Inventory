/*
http://example.com/path/to/resource/123455?someQueryParam=2
                   url              params query   
*/

const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const {
  readAllProducts,
  addProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} = require('./dal');
const { logger } = require('./logger');
const validator = require('./validator');
const app = express();
const port = 3000;

/*FUNCTIONS*/
const isTrue = (value) => (value + '').toLowerCase() === 'true';

app.use(bodyParser.json());
app.use(logger);

app.get('/products/', function (req, res) {
  const { includeDeleted } = req.query;

  const listAll = readAllProducts(isTrue(includeDeleted));

  if (Array.isArray(listAll)) res.json(listAll);
  else res.status(400).json('Read products failed');
});

app.get('/products/:uid', function (req, res) {
  const { uid } = req.params;
  const product = getProductById(uid);

  if (product) res.json(product);
  else res.status(404).send();
});

app.post('/products/', function (req, res) {
  const newProduct = { uid: uuidv4(), ...req.body };

  const validationResult = validator.validateProduct(newProduct);
  if (!validationResult.isValid) {
    res.status(400).json(validationResult);
    return;
  }

  const productAdded = addProduct(newProduct);

  if (productAdded) res.status(201).json(newProduct);
  else res.status(400).json('Create product failed');
});

app.post('/products/bulkInsert/', function (req, res) {
  const productsArr = req.body;

  if (!Array.isArray(productsArr)) {
    res.status(400).send('invalid body content');
    return;
  }

  const updatedProducts = productsArr.map((p) => ({ uid: uuidv4(), ...p }));

  updatedProducts.forEach((p) => {
    const validationResult = validator.validateProduct(p);
    if (!validationResult.isValid) {
      res.status(400).json(validationResult);
      return;
    }
  });

  const productsAdded = addProduct(updatedProducts);

  if (productsAdded) res.status(201).json(updatedProducts);
  else res.status(400).json('Create product failed');
});

app.put('/products/:uid', function (req, res) {
  const { uid } = req.params;
  const product = req.body;

  if (uid !== product.uid) {
    res.status(409).json('uid error');
    return;
  }

  if (updateProductById(product)) res.status(204).send();
  else res.status(400).json('Update product failed');
});

app.delete('/products/:uid', function (req, res) {
  const { uid } = req.params;

  const result = deleteProductById(uid);

  if (result === 404) {
    res.status(404).send();
    return;
  } else {
    res.status(204).send();
  }
});

app.listen(port, () => console.log(`server is listening on http://localhost:${port}/`));
