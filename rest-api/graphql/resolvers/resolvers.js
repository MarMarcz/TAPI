import fs from 'fs';
import path from 'path';
import { generateData } from '../../assets/generate.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// generateData();

const readData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../../companies.json'));
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(path.join(__dirname, '../../companies.json'), JSON.stringify(data, null, 2));
};

export const resolvers = {
  Query: {
    companies: () => {
      const data = readData();
      return data.companies;
    },
    ceos: (_, { filter }) => {
      const data = readData();
      let filteredCEOs = data.ceos;
    
      if (filter && filter.years_in_position) {
        const { equals, greater_than, less_than, greater_or_equal, less_or_equal } = filter.years_in_position;
    
        filteredCEOs = filteredCEOs.filter(ceo => {
          let isValid = true;
    
          if (equals !== undefined) {
            isValid = isValid && ceo.years_in_position === equals;
          }
          if (greater_than !== undefined) {
            isValid = isValid && ceo.years_in_position > greater_than;
          }
          if (less_than !== undefined) {
            isValid = isValid && ceo.years_in_position < less_than;
          }
          if (greater_or_equal !== undefined) {
            isValid = isValid && ceo.years_in_position >= greater_or_equal;
          }
          if (less_or_equal !== undefined) {
            isValid = isValid && ceo.years_in_position <= less_or_equal;
          }
    
          return isValid;
        });
      }
      return filteredCEOs;
    },
    locations: () => {
      const data = readData();
      return data.locations;
    },
  },
  Mutation: {
    createCompany: (_, { input }) => {
      const data = readData();
      const newCompany = {
        id: data.companies.length + 1,
        ...input,
      };
      data.companies.push(newCompany);
      writeData(data);
      return newCompany;
    },
    updateCompany: (_, { id, input }) => {
      const data = readData();
      const companyIndex = data.companies.findIndex(company => company.id === id);
      if (companyIndex === -1) {
        throw new Error(`Company with id ${id} not found.`);
      }

      const updatedCompany = { ...data.companies[companyIndex], ...input };
      data.companies[companyIndex] = updatedCompany;
      writeData(data);
      return updatedCompany;
    },
    deleteCompany: (_, { id }) => {
      const data = readData();
    
      const companyToDelete = data.companies.find(company => company.id === id);
      if (!companyToDelete) {
        throw new Error(`Company with id ${id} not found.`);
      }
    
      const updatedCompanies = data.companies.filter(company => company.id !== id);
      data.companies = updatedCompanies;
    
      writeData(data);
      return companyToDelete;
    },
    createCEO: (_, { input }) => {
      const data = readData();
      const newCEO = {
        id: data.ceos.length + 1,
        ...input,
      };
      data.ceos.push(newCEO);
      writeData(data);
      return newCEO;
    },
    updateCEO: (_, { id, input }) => {
      const data = readData();
      const ceoIndex = data.ceos.findIndex(ceo => ceo.id === id);
      if (ceoIndex === -1) {
        throw new Error(`CEO with id ${id} not found.`);
      }

      const updatedCEO = { ...data.ceos[ceoIndex], ...input };
      data.ceos[ceoIndex] = updatedCEO;
      writeData(data);
      return updatedCEO;
    },
    deleteCEO: (_, { id }) => {
      const data = readData();
    
      const ceoToDelete = data.ceos.find(ceo => ceo.id === id);
      if (!ceoToDelete) {
        throw new Error(`CEO with id ${id} not found.`);
      }
    
      const updatedCEOs = data.ceos.filter(ceo => ceo.id !== id);
      data.ceos = updatedCEOs;
    
      writeData(data);
      return ceoToDelete;
    },
    createLocation: (_, { input }) => {
      const data = readData();
      const newLocation = {
        id: data.locations.length + 1,
        ...input,
      };
      data.locations.push(newLocation);
      writeData(data);
      return newLocation;
    },
    updateLocation: (_, { id, input }) => {
      const data = readData();
      const locationIndex = data.locations.findIndex(location => location.id === id);
      if (locationIndex === -1) {
        throw new Error(`Location with id ${id} not found.`);
      }

      const updatedLocation = { ...data.locations[locationIndex], ...input };
      data.locations[locationIndex] = updatedLocation;
      writeData(data);
      return updatedLocation;
    },
    deleteLocation: (_, { id }) => {
      const data = readData();
    
      const locationToDelete = data.locations.find(location => location.id === id);
      if (!locationToDelete) {
        throw new Error(`Location with id ${id} not found.`);
      }
    
      const updatedLocations = data.locations.filter(location => location.id !== id);
      data.locations = updatedLocations;
    
      writeData(data);
      return locationToDelete;
    },
  },
}
