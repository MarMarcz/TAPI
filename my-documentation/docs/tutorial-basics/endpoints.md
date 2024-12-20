---
sidebar_position: 1
---
# Endpoints

This API provides endpoints to manage companies, CEOs, and locations. Below is the complete list of supported operations.

### **Companies**

#### **GET `/companies`**
Retrieves a list of all companies.

- **Responses:**
  - `200 OK`: Returns an array of company objects with HATEOAS links.
  - `404 Not Found`: If no companies are available.

- **Example Request:**
```http
GET /companies HTTP/1.1
Host: localhost:3000
```

---

#### **POST `/company`**
Adds a new company.

- **Responses:**
  - `201 Created`: Returns the created company object.

- **Example Request:**
```http
POST /company HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Example Corp",
  "ticker": "EXM",
  "industry": "Technology",
  "marketCap": 500000000,
  "ceo_id": 101,
  "location_id": 10
}
```

---

#### **PUT `/company/:id`**
Updates an entire company by its ID.

- **Parameters:**
  - `id` (Number): The unique identifier of the company.

- **Responses:**
  - `200 OK`: Returns the updated company object.
  - `404 Not Found`: If the company is not found.

- **Example Request:**
```http
PUT /company/1 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Updated Corp",
  "ticker": "UPD",
  "industry": "Finance",
  "marketCap": 750000000,
  "ceo_id": 102,
  "location_id": 11
}
```

---

#### **PATCH `/company/:id`**
Partially updates an company by its ID.

- **Parameters:**
  - `id` (Number): The unique identifier of the company.

- **Responses:**
  - `200 OK`: Returns the updated company object.
  - `404 Not Found`: If the company is not found.

- **Example Request:**
```http
PATCH /company/1 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
{
  "marketCap": 800000000
}
```

---

#### **DELETE `/company/:id`**
Deletes an company by its ID.

- **Parameters:**
  - `id` (Number): The unique identifier of the company.

- **Responses:**
  - `200 OK`: Returns the deleted company object.
  - `404 Not Found`: If the company is not found.

- **Example Request:**
```http
DELETE /company/1 HTTP/1.1
Host: localhost:3000
```

---

### **Ceos**

#### **GET `/ceos`**
Retrieves a list of all ceos.

- **Responses:**
  - `200 OK`: Returns an array of coes objects with HATEOAS links.
  - `404 Not Found`: If no coes are available.

- **Example Request:**
```http
GET /ceos HTTP/1.1
Host: localhost:3000
```

---

#### **POST `/ceo`**
Adds a new ceo.

- **Responses:**
  - `201 Created`: Returns the created ceo object.

- **Example Request:**
```http
POST /ceo HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Jane Doe",
  "age": 45,
  "years_in_position": 5,
  "previous_company": "OldCorp",
  "location_id": 12
}
```

---

#### **DELETE `/ceo/:id`**
Deletes a category by its ID.

- **Parameters:**
  - `id` (Number): The unique identifier of the category.

- **Responses:**
  - `200 OK`: Returns the deleted ceo object.
  - `404 Not Found`: If the ceo is not found.

- **Example Request:**
```http
DELETE /ceo/101 HTTP/1.1
Host: localhost:3000
```

---

### **Locations**

#### **GET `/locations`**
Retrieves a list of all payment methods.

- **Responses:**
  - `200 OK`: Returns an array of locations objects with HATEOAS links.
  - `404 Not Found`: If no locations are available.

- **Example Request:**
```http
GET /locations HTTP/1.1
Host: localhost:3000
```

---

#### **POST `/location`**
Adds a new location method.

- **Responses:**
  - `201 Created`: Returns the created location object.

- **Example Request:**
```http
POST /location HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "city": "New York",
  "state": "NY",
  "country": "USA"
}
```

---

#### **DELETE `/location/:id`**
Deletes a location by its ID.

- **Parameters:**
  - `id` (Number): The unique identifier of the location.

- **Responses:**
  - `200 OK`: Returns the deleted location object.
  - `404 Not Found`: If the location is not found.

- **Example Request:**
```http
DELETE /location/12 HTTP/1.1
Host: localhost:3000
```