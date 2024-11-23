import { generateCompany, generateCeo, generateLocation } from '../../assets/generate.js'

export const resolvers = {
  Query: {
    companies: () => {
      const companies = []
      for (let i = 1; i <= 10; i++) {
        const locationId = i
        const ceoId = 100 + i
        companies.push(generateCompany(i, ceoId, locationId))
      }
      return companies
    },
    ceos: () => {
      const ceos = []
      for (let i = 1; i <= 10; i++) {
        const ceoId = 100 + i
        const locationId = 100 + i
        ceos.push(generateCeo(ceoId, locationId))
      }
      return ceos
    },
    locations: () => {
      const locations = []
      for (let i = 1; i <= 10; i++) {
        locations.push(generateLocation(i))
        locations.push(generateLocation(100 + i))
      }
      return locations
    },
  },
}
