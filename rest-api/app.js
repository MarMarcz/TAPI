import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { generateData } from './assets/generate.js';
// import { companyRouter } from './routes/companyRoute.js';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Express');
  res.setHeader('X-Author', 'Martyna');
  res.setHeader('Content-Type', 'application/json');
  next();
});

generateData();

const readData = () => {
  const data = fs.readFileSync(path.join(__dirname, 'companies.json'));
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(path.join(__dirname, 'companies.json'), JSON.stringify(data, null, 2));
};

//COMPANIES
app.get('/companies', (req, res) => {
  const data = readData();
  const companies = data.companies;
  if (companies && companies.length > 0) {
    const companiesWithLinks = companies.map(company => ({
      ...company,
      links: [
        { rel: "self", method: "GET", href: `http://localhost:3000/company/${company.id}` },
        { rel: "update", method: "PUT", href: `http://localhost:3000/company/${company.id}` },
        { rel: "partial_update", method: "PATCH", href: `http://localhost:3000/company/${company.id}` },
        { rel: "delete", method: "DELETE", href: `http://localhost:3000/company/${company.id}` },
        { rel: "ceo", method: "GET", href: `http://localhost:3000/ceo/${company.ceo_id}` },
        { rel: "location", method: "GET", href: `http://localhost:3000/location/${company.location_id}` }
      ]
    }));

    res.status(200).json(companiesWithLinks);
  } else {
    res.status(404).send('No companies found');
  }
});

app.get('/company/:id', (req, res) => {
  const data = readData();
  const company = data.companies.find(c => c.id === Number(req.params.id));
  if (company) {
    const companyWithLinks = {
      ...company,
      links: [
        { rel: "self", method: "GET", href: `http://localhost:3000/company/${company.id}` },
        { rel: "update", method: "PUT", href: `http://localhost:3000/company/${company.id}` },
        { rel: "partial_update", method: "PATCH", href: `http://localhost:3000/company/${company.id}` },
        { rel: "delete", method: "DELETE", href: `http://localhost:3000/company/${company.id}` },
        { rel: "ceo", method: "GET", href: `http://localhost:3000/ceos/${company.ceo_id}` },
        { rel: "location", method: "GET", href: `http://localhost:3000/locations/${company.location_id}` },
        { rel: "all_companies", method: "GET", href: `http://localhost:3000/companies` }
      ]
    };

    res.status(200).json(companyWithLinks);
  } else {
    res.status(404).send('Company not found');
  }
});

app.post('/company', (req, res) => {
  const data = readData();
  const newCompany = req.body;

  const newId = data.companies.length > 0 ? Math.max(...data.companies.map(c => c.id)) + 1 : 1;
  newCompany.id = newId;

  data.companies.push(newCompany);
  writeData(data);

  res.status(201).json(newCompany);
});

app.put('/company/:id', (req, res) => {
  const data = readData();
  const companyIndex = data.companies.findIndex(c => c.id === Number(req.params.id));

  if (companyIndex === -1) {
    return res.status(404).send('Company not found');
  }

  const newCompany = req.body;
  newCompany.id = Number(req.params.id);

  data.companies[companyIndex] = newCompany;

  writeData(data);

  res.status(200).json(newCompany);
});

app.patch('/company/:id', (req, res) => {
  const data = readData();
  const companyIndex = data.companies.findIndex(c => c.id === Number(req.params.id));

  if (companyIndex === -1) {
    return res.status(404).send('Company not found');
  }

  const updatedCompany = { ...data.companies[companyIndex], ...req.body };
  data.companies[companyIndex] = updatedCompany;

  writeData(data);

  res.status(200).json(updatedCompany);
});

app.delete('/company/:id', (req, res) => {
  const data = readData();
  const updatedCompanies = data.companies.filter(c => c.id !== Number(req.params.id));
  data.companies = updatedCompanies;
  writeData(data);
  res.status(204).send();
});

//CEOS
app.get('/ceos', (req, res) => {
  const data = readData();
  const ceosWithLinks = data.ceos.map(ceo => ({
    ...ceo,
    links: [
      { rel: "self", method: "GET", href: `http://localhost:3000/ceo/${ceo.id}` },
      { rel: "previous_company", method: "GET", href: `http://localhost:3000/companies?name=${encodeURIComponent(ceo.previous_company)}` },
      { rel: "location", method: "GET", href: `http://localhost:3000/location/${ceo.location_id}` }
    ]
  }));
  res.status(200).json(ceosWithLinks);
});

app.get('/ceo/:id', (req, res) => {
  const data = readData();
  const ceo = data.ceos.find(c => c.id === Number(req.params.id));
  if (ceo) {
    const ceoWithLinks = {
      ...ceo,
      links: [
        { rel: "self", method: "GET", href: `http://localhost:3000/ceo/${ceo.id}` },
        { rel: "previous_company", method: "GET", href: `http://localhost:3000/companies?name=${encodeURIComponent(ceo.previous_company)}` },
        { rel: "location", method: "GET", href: `http://localhost:3000/location/${ceo.location_id}` }
      ]
    };
    res.status(200).json(ceoWithLinks);
  } else {
    res.status(404).send('CEO not found');
  }
});

app.post('/ceo', (req, res) => {
  const data = readData();
  const newCeo = req.body;

  const newId = data.ceos.length > 0 ? Math.max(...data.ceos.map(c => c.id)) + 1 : 100;
  newCeo.id = newId;

  data.ceos.push(newCeo);
  writeData(data);

  res.status(201).json(newCeo);
});

app.put('/ceo/:id', (req, res) => {
  const data = readData();
  const ceoIndex = data.ceos.findIndex(c => c.id === Number(req.params.id));

  if (ceoIndex === -1) {
    return res.status(404).send('CEO not found');
  }

  const updatedCeo = req.body;

  if (!updatedCeo.name || !updatedCeo.age || !updatedCeo.years_in_position || !updatedCeo.previous_company || !updatedCeo.location_id) {
    return res.status(400).send('Ceo details are required');
  }

  updatedCeo.id = Number(req.params.id);
  data.ceos[ceoIndex] = updatedCeo;
  writeData(data);

  res.status(200).json(updatedCeo);
});

app.patch('/ceo/:id', (req, res) => {
  const data = readData();
  const ceoIndex = data.ceos.findIndex(c => c.id === Number(req.params.id));

  if (ceoIndex === -1) {
    return res.status(404).send('CEO not found');
  }

  const updatedCeo = { ...data.ceos[ceoIndex], ...req.body };
  data.ceos[ceoIndex] = updatedCeo;

  writeData(data);

  res.status(200).json(updatedCeo);
});

app.delete('/ceo/:id', (req, res) => {
  const data = readData();
  const updatedCeos = data.ceos.filter(c => c.id !== Number(req.params.id));
  if (data.ceos.length === updatedCeos.length) {
    return res.status(404).send('CEO not found');
  }
  data.ceos = updatedCeos;
  writeData(data);
  res.status(204).send();
});

//LOCATIONS
app.get('/locations/', (req, res) => {
  const data = readData();
  const locationsWithLinks = data.locations.map(location => ({
    ...location,
    links: [
      { rel: "self", method: "GET", href: `http://localhost:3000/location/${location.id}` },
      { rel: "companies_in_location", method: "GET", href: `http://localhost:3000/companies?location_id=${location.id}` }
    ]
  }));
  res.status(200).json(locationsWithLinks);
});

app.get('/location/:id', (req, res) => {
  const data = readData();
  const location = data.locations.find(l => l.id === Number(req.params.id));
  if (location) {
    const locationWithLinks = {
      ...location,
      links: [
        { rel: "self", method: "GET", href: `http://localhost:3000/location/${location.id}` },
        { rel: "companies_in_location", method: "GET", href: `http://localhost:3000/companies?location_id=${location.id}` }
      ]
    };
    res.status(200).json(locationWithLinks);
  } else {
    res.status(404).send('Location not found');
  }
});

app.post('/location', (req, res) => {
  const data = readData();
  const newLocation = req.body;

  const newId = data.locations.length > 0 ? Math.max(...data.locations.map(l => l.id)) + 1 : 1;
  newLocation.id = newId;

  data.locations.push(newLocation);
  writeData(data);

  res.status(201).json(newLocation);
});

app.put('/location/:id', (req, res) => {
  const data = readData();
  const locationIndex = data.locations.findIndex(l => l.id === Number(req.params.id));

  if (locationIndex === -1) {
    return res.status(404).send('Location not found');
  }

  const updatedLocation = req.body;

  if (!updatedLocation.city || !updatedLocation.country || !updatedLocation.state) {
    return res.status(400).send('City and country and state are required');
  }

  updatedLocation.id = Number(req.params.id);
  data.locations[locationIndex] = updatedLocation;
  writeData(data);

  res.json(updatedLocation);
});

app.patch('/location/:id', (req, res) => {
  const data = readData();
  const locationIndex = data.locations.findIndex(l => l.id === Number(req.params.id));

  if (locationIndex === -1) {
    return res.status(404).send('Location not found');
  }

  const updatedLocation = { ...data.locations[locationIndex], ...req.body };
  data.locations[locationIndex] = updatedLocation;

  writeData(data);

  res.json(updatedLocation);
});

app.delete('/location/:id', (req, res) => {
  const data = readData();
  const updatedLocations = data.locations.filter(c => c.id !== Number(req.params.id));
  if (data.locations.length === updatedLocations.length) {
    return res.status(404).send('Location not found');
  }
  data.locations = updatedLocations;
  writeData(data);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
