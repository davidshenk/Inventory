const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/product/create/', function (req, res) {
    const newProduct = { id: uuidv4(), ...req.body };
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
    res.json(newCar);
  });
  
  app.get('/cars/', function (req, res) {
    const listAll = require('./inventory_list.json');
    res.json(listAll);
  });
  
  app.get('/cars/:id', function (req, res) {
    const { id } = req.params;
    const listAll = require('./inventory_list.json');
    const currentCar = listAll.find((car) => id == car.id);
    if (currentCar) res.json(currentCar);
    else res.status(404).send();
  });
  
  app.put('/cars/update/:id', function (req, res) {
    const { id } = req.params;
    const carDetails = req.body;
  
    const listAll = require('./inventory_list.json');
    const currentCarIndex = listAll.findIndex((car) => id == car.id);
    if (currentCarIndex == -1) {
      res.status(404).send();
    } else {
      // update list
      listAll[currentCarIndex] = { ...listAll[currentCarIndex], ...carDetails };
      //save to file
      fs.writeFileSync('inventory_list.json', JSON.stringify(listAll, null, 2), (error) => {
        if (error) console.log('error');
        else console.log('successfuly');
      });
      // return
      res.send();
    }
  });
  
  app.post('/cars/delete/:id', function (req, res) {
    const { id } = req.params;
    const listAll = require('./inventory_list.json');
    const currentCarIndex = listAll.findIndex((car) => id == car.id);
    if (currentCarIndex == -1) console.log('error');
    else {
      const carToArchives = listAll[currentCarIndex];
      const updatedList = listAll.filter((car) => id != car.id);
      fs.writeFileSync('inventory_list.json', JSON.stringify(updatedList, null, 2), (error) => {
        if (error) console.log('error');
        else console.log('succesfuly');
      });
  
      let archivesList = [];
  
      if (fs.existsSync('archives_inventory_list.json')) {
        archivesList = require('./archives_inventory_list.json');
      }
      archivesList.push(carToArchives);
  
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