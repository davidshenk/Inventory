const fs = require('fs');

const dbFile = './inventory_list.json';

const readAllProducts = (includeDeleted = false) => {
  if (!fs.existsSync(dbFile)) return [];

  const listStr = fs.readFileSync(dbFile, { encoding: 'utf8' });
  const list = JSON.parse(listStr);
  const listToSend = includeDeleted ? list : list.filter((p) => !p.isDeleted);
  return listToSend;
};

const updateDB = (str) => {
  try {
    fs.writeFileSync(dbFile, str, 'utf8');
  } catch {
    return false;
  }

  return true;
};

const addProduct = (product) => {
  const list = [...readAllProducts(), product];
  return updateDB(JSON.stringify(list));
};

const addProducts = (products) => {
  const list = [...readAllProducts(), ...products];
  return updateDB(JSON.stringify(list));
};

const getProductById = (uid) => {
  const list = readAllProducts();
  const product = list.find((p) => p.uid === uid);

  return product;
};

const updateProductById = (product) => {
  const list = readAllProducts(true);
  const productIndex = list.findIndex((p) => p.uid == product.uid);

  if (productIndex === -1) return false;

  list[productIndex] = { ...list[productIndex], ...product };
  return updateDB(JSON.stringify(list));
};

const deleteProductById = (uid) => {
  const existingProduct = getProductById(uid);

  if (!existingProduct) return 404;

  existingProduct.isDeleted = true;
  return updateProductById(existingProduct);
};

const exportModules = {
  readAllProducts,
  addProduct,
  addProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
module.exports = exportModules;
