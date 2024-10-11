import { faker } from '@faker-js/faker';

export const generateCompany = (id) => {
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
        CEO: {
            name: faker.person.fullName(),
            age: faker.number.int({ min: 30, max: 70 }),
            years_in_position: faker.number.int({ min: 1, max: 15 }),
            previous_company: faker.company.name(),
            location: {
                country: faker.location.country(),
                state: faker.location.state(),
                city: faker.location.city()
            }
        },
        location: {
            country: faker.location.country(),
            state: faker.location.state(),
            city: faker.location.city()
        }
    };
};



// const books = [];

// for (let i = 0; i < 10; i++) {
//     books.push(generateCompany(i));
// }