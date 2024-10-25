import { faker } from '@faker-js/faker';
import fs from 'fs';

export const generateCompany = (id, ceoId) => {
    faker.seed(id);

    return {
        id: id,
        company_name: faker.company.name(),
        ticker: faker.string.alpha({ length: 3 }).toUpperCase(),
        industry: faker.commerce.department(),
        market_cap: faker.number.int({ min: 1000000000, max: 20000000000 }),
        stock_price: faker.finance.amount({ min: 1, max: 300, dec: 2, symbol: '$' }),
        annual_change_percentage: faker.finance.amount({ min: -40, max: 100, symbol: '%' }),
        pe_ratio: faker.finance.amount({ min: 0, max: 40 }),
        last_update: faker.date.recent().toISOString().split('T')[0],
        ceo_id: ceoId,
        location: {
            id: id,
            country: faker.location.country(),
            state: faker.location.state(),
            city: faker.location.city()
        }
    };
};

export const generateCeo = (id) => {
    faker.seed(id);
  
    return {
      id: id,
      name: faker.person.fullName(),
      age: faker.number.int({ min: 30, max: 70 }),
      years_in_position: faker.number.int({ min: 1, max: 15 }),
      previous_company: faker.company.name(),
      location_ceo: {
        id: id,
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city()
      }
    };
  };

export const generateData = () => {
    const companies = [];
    const ceos = [];
    for (let i = 1; i <= 10; i++) {
      const ceoId = 100 + i;
      ceos.push(generateCeo(ceoId));
      companies.push(generateCompany(i, ceoId));
    }
  
    const data = { companies, ceos };
    fs.writeFileSync('companies.json', JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Data successfully saved to companies.json');
      }
    });
  };
