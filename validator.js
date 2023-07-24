const jsonschemaValidate = require('jsonschema').validate;

const productSchema = {
  uid: 'string',
  title: 'string',
  description: 'string',
  price: 'number',
  rating: 'number',
  stock: 'number',
  brand: 'string',
  category: 'string',
  images: {
    type: 'array',
    items: { type: 'string' },
  },
  required: ['uid', 'title', 'price', 'stock', 'brand', 'category', 'images'],
};

const validateProduct = (product) => {
  const result = { isValid: false, errorMessage: '' };

  const schemaValidation = jsonschemaValidate(product, productSchema);

  if (!schemaValidation.valid) {
    result.errorMessage = schemaValidation.errors;
    return result;
  }

  if (product.title.trim() === '') {
    result.errorMessage = 'title is missing';
    return result;
  }

  if (+product.price < 0) {
    result.errorMessage = 'price is missing or cannot be less than 0';
    return result;
  }

  if (+product.stock < 0) {
    result.errorMessage = 'stock cannot be less than 0';
    return result;
  }

  if (product.brand.trim() === '') {
    result.errorMessage = 'brand is missing';
    return result;
  }

  if (product.category.trim() === '') {
    result.errorMessage = 'category is missing';
    return result;
  }

  if (product.images?.length === 0) {
    result.errorMessage = 'you must add at least 1 image';
    return result;
  }

  result.isValid = true;
  return result;
};

const validator = { validateProduct };
module.exports = validator;
