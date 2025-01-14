---
sidebar_position: 2
---

# Function

This documentation provides details about the **Dinozaur API** endpoints, including functionality for managing companies, CEOs, and locations. The API leverages randomly generated data for demonstration purposes using `faker-js`.

### Data Generation

#### Category company

```javascript
export const generateCompany = (id, ceoId, locationId) => {
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
        location_id: locationId
    };
};
```

#### Ceo

```javascript
export const generateCeo = (id, locationId) => {
    faker.seed(id);
  
    return {
        id: id,
        name: faker.person.fullName(),
        age: faker.number.int({ min: 30, max: 70 }),
        years_in_position: faker.number.int({ min: 1, max: 15 }),
        previous_company: faker.company.name(),
        location_id: locationId 
    };
};
```

#### Locations

```javascript
export const generateLocation = (id) => {
    faker.seed(id);

    return {
        id: id,
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city()
    };
};
```

#### Data

```javascript
export const generateData = () => {
    const companies = [];
    const ceos = [];
    const locations = [];

    for (let i = 1; i <= 10; i++) {
        const locationIdCompany = i;
        const locationIdCeo = 100 + i;

        locations.push(generateLocation(locationIdCompany));
        locations.push(generateLocation(locationIdCeo));

        const ceoId = 100 + i;
        ceos.push(generateCeo(ceoId, locationIdCeo));
        companies.push(generateCompany(i, ceoId, locationIdCompany));
    }

    const data = { companies, ceos, locations };
    fs.writeFileSync('companies.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Data successfully saved to companies.json');
        }
    });
};
```

### Notes
This API includes middleware for content type validation and request tracking. All endpoints return data with HATEOAS links for navigation.