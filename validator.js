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
  let errorMessage = '';

  const schemaValidationRes = validateProductPropertyValue('schema', product);
  if (!schemaValidationRes.isValid) {
    errorMessage = schemaValidationRes.msg;
  } else {
    const propsToValiadate = ['title', 'brand', 'category', 'price', 'stock', 'images'];
    const validationResult = validateProps(propsToValiadate, product);

    if (!validationResult.isValid) {
      errorMessage = validationResult.msg;
      //   return;
    }
  }

  return { isValid: errorMessage === '', errorMessage };
};

const validateUpdatedProduct = (product) => {
  const propsToValiadate = Object.keys(product).filter((k) => k !== 'uid');
  const validationResult = validateProps(propsToValiadate, product);

  return validationResult;
};

const validateProps = (props, product) => {
  let msg = '';

  try {
    props.forEach((prop) => {
      const res = validateProductPropertyValue(prop, product[prop]);

      if (!res.isValid) {
        msg = res.msg;
        throw 'break';
      }
    });
  } catch (e) {
    if (e !== 'break') throw e;
  }

  return { isValid: msg === '', msg };
};

const validateProductPropertyValue = (prop, value) => {
  let msg = '';

  switch (prop) {
    case 'schema':
      const schemaValidation = jsonschemaValidate(value, productSchema);
      if (!schemaValidation.valid) {
        msg = schemaValidation.errors;
      }
      break;

    case 'title':
    case 'brand':
    case 'category':
      if (value.trim() === '') {
        msg = `${prop} is missing`;
      }
      break;

    case 'price':
    case 'stock':
      if (+value < 0) {
        msg = `${prop} cannot be less than 0`;
      }
      break;

    case 'images':
      if (!Array.isArray(value) || value.length < 1) {
        msg = `at least 1 image is required`;
      }
      break;

    default:
      break;
  }

  return { isValid: msg === '', msg };
};

const validator = { validateProduct, validateUpdatedProduct };
module.exports = validator;
