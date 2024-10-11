import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path'; 
import { generateData } from './assets/generate.js';

const app = new express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

generateData(); 

const readData = () => {
  const data = fs.readFileSync(path.join(__dirname, 'companies.json')); 
  return JSON.parse(data); 
};

const writeData = (data) => {
  fs.writeFileSync(path.join(__dirname, 'companies.json'), JSON.stringify(data, null, 2)); 
};

app.get('/:id', (req, res) => {
  const companies = readData();
  const company = companies.find(c => c.id === Number(req.params.id));
  if (company) {
    res.json(company); 
  } else {
    res.status(404).send('Company not found');
  }
});

app.delete('/:id', (req, res) => {
  const companies = readData();
  const updatedCompanies = companies.filter(c => c.id !== Number(req.params.id));
  writeData(updatedCompanies); 
  res.send(`Deleted company with id: ${req.params.id}`);
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
