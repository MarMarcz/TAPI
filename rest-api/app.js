import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { generateData } from './assets/generate.js';
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Companies API',
      version: '1.0.0',
      description: 'API for managing companies, CEOs, and locations.',
      contact: {
        name: 'Martyna',
        email: 'martyna@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:3000`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Company: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID of the company' },
            name: { type: 'string', description: 'Name of the company' },
            ticker: { type: 'string', description: 'Ticker symbol of the company' },
            industry: { type: 'string', description: 'Industry of the company' },
            marketCap: { type: 'number', description: 'Market capitalization of the company' },
            ceo_id: { type: 'integer', description: 'ID of the CEO' },
            location_id: { type: 'integer', description: 'ID of the company location' },
          },
          required: ['id', 'name', 'ticker', 'industry', 'ceo_id', 'location_id'],
        },
        CEO: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID of the CEO' },
            name: { type: 'string', description: 'Name of the CEO' },
            age: { type: 'integer', description: 'Age of the CEO' },
            years_in_position: { type: 'integer', description: 'Years in position' },
            previous_company: { type: 'string', description: 'Previous company of the CEO' },
            location_id: { type: 'integer', description: 'Location ID associated with the CEO' },
          },
          required: ['id', 'name', 'age', 'years_in_position', 'previous_company', 'location_id'],
        },
        Location: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID of the location' },
            city: { type: 'string', description: 'City of the location' },
            state: { type: 'string', description: 'State of the location' },
            country: { type: 'string', description: 'Country of the location' },
          },
          required: ['id', 'city', 'state', 'country'],
        },
      },
    },
    tags: [
      { name: 'Companies', description: 'Zarządzanie firmami' },
      { name: 'CEOs', description: 'Zarządzanie CEO' },
      { name: 'Locations', description: 'Zarządzanie lokalizacjami' },
    ],
  },
  apis: ["./app.js"],
  // apis: [__filename],
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(cors());  //TODO: add config
app.use((req, res, next) => {
  //res.setHeader('X-Powered-By', 'Express');
  res.setHeader('X-Author', 'Martyna');
  res.setHeader('X-Something', 'Hi');
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
/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Retrieve a list of companies with HATEOAS links
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: A list of companies with HATEOAS links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       404:
 *         description: No companies found
 */
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

/**
 * @swagger
 * /company/{id}:
 *   get:
 *     summary: Retrieve a company by ID with HATEOAS links
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company to retrieve
 *     responses:
 *       200:
 *         description: Company details with HATEOAS links
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */

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

/**
 * @swagger
 * /company:
 *   post:
 *     summary: Create a new company
 *     tags:
 *       - Companies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 */
app.post('/company', (req, res) => {
  const data = readData();
  const newCompany = req.body;

  const newId = data.companies.length > 0 ? Math.max(...data.companies.map(c => c.id)) + 1 : 1;
  newCompany.id = newId;

  data.companies.push(newCompany);
  writeData(data);

  res.status(201).json(newCompany);
});

/**
 * @swagger
 * /company/{id}:
 *   put:
 *     summary: Update an existing company by ID
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */
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

/**
 * @swagger
 * /company/{id}:
 *   patch:
 *     summary: Partially update an existing company by ID
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Partial company data to update
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */
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

/**
 * @swagger
 * /company/{id}:
 *   delete:
 *     summary: Delete a company by ID
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company to delete
 *     responses:
 *       204:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 */
app.delete('/company/:id', (req, res) => {
  const data = readData();
  const updatedCompanies = data.companies.filter(c => c.id !== Number(req.params.id));
  data.companies = updatedCompanies;
  writeData(data);
  res.status(204).send();
});

//CEOS
/**
 * @swagger
 * /ceos:
 *   get:
 *     summary: Retrieve a list of CEOs with HATEOAS links
 *     tags:
 *       - CEOs
 *     responses:
 *       200:
 *         description: A list of CEOs with HATEOAS links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CEO'
 */
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

/**
 * @swagger
 * /ceo/{id}:
 *   get:
 *     summary: Retrieve a CEO by ID with HATEOAS links
 *     tags:
 *       - CEOs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the CEO to retrieve
 *     responses:
 *       200:
 *         description: CEO details with HATEOAS links
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CEO'
 *       404:
 *         description: CEO not found
 */
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

/**
 * @swagger
 * /ceo:
 *   post:
 *     summary: Create a new CEO
 *     tags:
 *       - CEOs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CEO'
 *     responses:
 *       201:
 *         description: CEO created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CEO'
 */
app.post('/ceo', (req, res) => {
  const data = readData();
  const newCeo = req.body;

  const newId = data.ceos.length > 0 ? Math.max(...data.ceos.map(c => c.id)) + 1 : 100;
  newCeo.id = newId;

  data.ceos.push(newCeo);
  writeData(data);

  res.status(201).json(newCeo);
});

/**
 * @swagger
 * /ceo/{id}:
 *   put:
 *     summary: Update an existing CEO by ID
 *     tags:
 *       - CEOs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the CEO to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CEO'
 *     responses:
 *       200:
 *         description: CEO updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CEO'
 *       400:
 *         description: Missing required CEO details
 *       404:
 *         description: CEO not found
 */
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

/**
 * @swagger
 * /ceo/{id}:
 *   patch:
 *     summary: Partially update an existing CEO by ID
 *     tags:
 *       - CEOs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the CEO to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Partial CEO data to update
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: CEO updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CEO'
 *       404:
 *         description: CEO not found
 */
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

/**
 * @swagger
 * /ceo/{id}:
 *   delete:
 *     summary: Delete a CEO by ID
 *     tags:
 *       - CEOs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the CEO to delete
 *     responses:
 *       204:
 *         description: CEO deleted successfully
 *       404:
 *         description: CEO not found
 */
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
/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Retrieve a list of locations with HATEOAS links
 *     tags:
 *       - Locations
 *     responses:
 *       200:
 *         description: A list of locations with HATEOAS links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 */
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

/**
 * @swagger
 * /location/{id}:
 *   get:
 *     summary: Retrieve a location by ID with HATEOAS links
 *     tags:
 *       - Locations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the location to retrieve
 *     responses:
 *       200:
 *         description: Location details with HATEOAS links
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 */
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

/**
 * @swagger
 * /location:
 *   post:
 *     summary: Create a new location
 *     tags:
 *       - Locations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       201:
 *         description: Location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 */
app.post('/location', (req, res) => {
  const data = readData();
  const newLocation = req.body;

  const newId = data.locations.length > 0 ? Math.max(...data.locations.map(l => l.id)) + 1 : 1;
  newLocation.id = newId;

  data.locations.push(newLocation);
  writeData(data);

  res.status(201).json(newLocation);
});

/**
 * @swagger
 * /location/{id}:
 *   put:
 *     summary: Update an existing location by ID
 *     tags:
 *       - Locations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the location to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Missing required location details (city, country, state)
 *       404:
 *         description: Location not found
 */
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

/**
 * @swagger
 * /location/{id}:
 *   patch:
 *     summary: Partially update an existing location by ID
 *     tags:
 *       - Locations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the location to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Partial location data to update
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 */
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

/**
 * @swagger
 * /location/{id}:
 *   delete:
 *     summary: Delete a location by ID
 *     tags:
 *       - Locations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the location to delete
 *     responses:
 *       204:
 *         description: Location deleted successfully
 *       404:
 *         description: Location not found
 */
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
