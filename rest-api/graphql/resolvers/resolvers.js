import fs from 'fs';
import path from 'path';
import { generateData } from '../../assets/generate.js';
import { fileURLToPath } from 'url';
import { GraphQLScalarType, Kind } from 'graphql';
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

const URLScalar = new GraphQLScalarType({
  name: 'URL',
  description: 'Customowy scalar do obsługi poprawnych adresów URL',
  serialize(value) {
    try {
      return new URL(value).toString();
    } catch {
      throw new Error('Nieprawidłowy URL.');
    }
  },
  parseValue(value) {
    try {
      return new URL(value).toString();
    } catch {
      throw new Error('Nieprawidłowy URL.');
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      try {
        return new URL(ast.value).toString();
      } catch {
        throw new Error('Nieprawidłowy URL.');
      }
    }
    throw new Error('Scalar URL akceptuje tylko ciągi znaków.');
  },
});

const applyFilters = (data, filters) => {
  if (!filters) return data;

  return data.filter(item => {
    return Object.keys(filters).every(field => {
      const filterCondition = filters[field];
      if (!filterCondition) return true;

      let isValid = true;

      if (filterCondition.equals !== undefined) {
        isValid = isValid && item[field] === filterCondition.equals;
      }
      if (filterCondition.greater_than !== undefined) {
        isValid = isValid && item[field] > filterCondition.greater_than;
      }
      if (filterCondition.less_than !== undefined) {
        isValid = isValid && item[field] < filterCondition.less_than;
      }
      if (filterCondition.greater_or_equal !== undefined) {
        isValid = isValid && item[field] >= filterCondition.greater_or_equal;
      }
      if (filterCondition.less_or_equal !== undefined) {
        isValid = isValid && item[field] <= filterCondition.less_or_equal;
      }
      if (filterCondition.contains !== undefined) {
        isValid = isValid && String(item[field]).includes(filterCondition.contains);
      }
      if (filterCondition.not_contains !== undefined) {
        isValid = isValid && !String(item[field]).includes(filterCondition.not_contains);
      }

      return isValid;
    });
  });
};

const applySorting = (data, sort) => {
  if (!sort) return data;

  const { field, order } = sort;

  return data.sort((a, b) => {
    if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
    if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

const applyPagination = (data, pagination) => {
  if (!pagination) return data;

  const { page, pageSize } = pagination;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return data.slice(start, end);
};

export const resolvers = {
  URL: URLScalar,
  Query: {
    validateURL: (_, { url }) => {
      return url;
    },
    companies: (_, { filter, sort, pagination }) => {
      const data = readData().companies;
    
      let result = applyFilters(data, filter);
    
      result = applySorting(result, sort);
    
      result = applyPagination(result, pagination);
    
      return result;
    },
    ceos: (_, { filter, sort, pagination }) => {
      const data = readData().ceos;
    
      let result = applyFilters(data, filter);
    
      result = applySorting(result, sort);
    
      result = applyPagination(result, pagination);
    
      return result;
    },
    locations: (_, { filter, sort, pagination }) => {
      const data = readData().locations;
    
      let result = applyFilters(data, filter);
    
      result = applySorting(result, sort);
    
      result = applyPagination(result, pagination);
    
      return result;
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
