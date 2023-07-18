const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/products/create/', function (req, res) {
    const newProduct = { uid: uuidv4(), ...req.body };
    let list = [];
  
    if (fs.existsSync('inventory_list.json')) {
      list = require('./inventory_list.json');
    }
  
    list.push(newProduct);
  
    fs.writeFileSync('inventory_list.json', JSON.stringify(list, null, 2), (error) => {
      if (error) console.log('error');
      else console.log('successfuly');
    });
    const length = list.length
    console.log(length);
    res.json(newProduct);
  });
  
  app.get('/products/', function (req, res) {
    const listAll = require('./inventory_list.json');
    res.json(listAll);
  });
  
  app.get('/products/:id', function (req, res) {
    const { id } = req.params;
    const listAll = require('./inventory_list.json');
    const currentProduct = listAll.find((product) => id == product.id);
    if (currentProduct) res.json(currentProduct);
    else res.status(404).send();
  });
  
  app.put('/products/update/:id', function (req, res) {
    const { id } = req.params;
    const productDetails = req.body;
  
    const listAll = require('./inventory_list.json');
    const currentProductIndex = listAll.findIndex((product) => id == product.id);
    if (currentProductIndex == -1) {
      res.status(404).send();
    } else {
      // update list
      listAll[currentProductIndex] = { ...listAll[currentProductIndex], ...productDetails };
      //save to file
      fs.writeFileSync('inventory_list.json', JSON.stringify(listAll, null, 2), (error) => {
        if (error) console.log('error');
        else console.log('successfuly');
      });
      // return
      res.send();
    }
  });
  
  app.post('/products/delete/:id', function (req, res) {
    const { id } = req.params;
    const listAll = require('./inventory_list.json');
    const currentProductIndex = listAll.findIndex((product) => id == product.id);
    if (currentProductIndex == -1) console.log('error');
    else {
      const productToArchives = listAll[currentProductIndex];
      const updatedList = listAll.filter((product) => id != product.id);
      fs.writeFileSync('inventory_list.json', JSON.stringify(updatedList, null, 2), (error) => {
        if (error) console.log('error');
        else console.log('succesfuly');
      });
  
      let archivesList = [];
  
      if (fs.existsSync('archives_inventory_list.json')) {
        archivesList = require('./archives_inventory_list.json');
      }
      archivesList.push(productToArchives);
  
      fs.writeFileSync('archives_inventory_list.json', JSON.stringify(archivesList, null, 2), (error) => {
        if (error) console.log('error');
        else console.log('succesfuly');
      });
      res.send();
      const length = updatedList.length
    console.log(length);
    }
    
  });
  
  app.listen(port, () => console.log('server starts'));