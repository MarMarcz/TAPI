import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path'; 
import { generateData } from './assets/generate.js';

const app = new express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

generateData(); 

const readData = () => {
  const data = fs.readFileSync(path.join(__dirname, 'companies.json')); 
  return JSON.parse(data); 
};

const writeData = (data) => {
  fs.writeFileSync(path.join(__dirname, 'companies.json'), JSON.stringify(data, null, 2)); 
};

app.get('/all', (req, res) => {
  const companies = readData();
  if (companies && companies.length > 0) {
    res.json(companies); 
  } else {
    res.status(404).send('No companies found');
  }
});  

app.get('/:id', (req, res) => {
  const companies = readData();
  const company = companies.find(c => c.id === Number(req.params.id));
  if (company) {
    res.json(company); 
  } else {
    res.status(404).send('Company not found');
  }
});

app.post('/', (req, res) => {
  const companies = readData();
  const newCompany = req.body;
  
  const newId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;
  newCompany.id = newId;

  companies.push(newCompany);
  writeData(companies);

  res.status(201).json(newCompany); 
});

app.put('/:id', (req, res) => {
  const companies = readData();
  const companyIndex = companies.findIndex(c => c.id === Number(req.params.id));

  if (companyIndex === -1) {
    return res.status(404).send('Company not found');
  }

  const newCompany = req.body;
  newCompany.id = Number(req.params.id); 

  companies[companyIndex] = newCompany;

  writeData(companies);

  res.json(newCompany);
});

app.patch('/:id', (req, res) => {
  const companies = readData();
  const companyIndex = companies.findIndex(c => c.id === Number(req.params.id));

  if (companyIndex === -1) {
    return res.status(404).send('Company not found');
  }

  const updatedCompany = { ...companies[companyIndex], ...req.body };
  companies[companyIndex] = updatedCompany;

  writeData(companies);

  res.json(updatedCompany);
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
