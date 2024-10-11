import express from 'express';
import { faker } from '@faker-js/faker';
import { generateCompany } from './assets/generate.js';

const app = new express();
const port = 3000;

app.get('/:id', (req, res) => {
  res.send(generateCompany(Number(req.params.id)));
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
