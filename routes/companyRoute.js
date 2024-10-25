// import express from "express";

// export const companyRouter = express.Router();

// companyRouter.get("/companies", (req, res) => {
//   res.send("/companies");
// });

// const readData = () => {
//     const data = fs.readFileSync(path.join(__dirname, 'companies.json')); 
//     return JSON.parse(data); 
// };

// const writeData = (data) => {
//     fs.writeFileSync(path.join(__dirname, 'companies.json'), JSON.stringify(data, null, 2)); 
// };

// app.get('/companies', (req, res) => {
//     const companies = readData();
//     if (companies && companies.length > 0) {
//         res.json(companies); 
//     } else {
//         res.status(404).send('No companies found');
//     }
// });  