export function fetchAllProducts() {
  return new Promise(async (resolve) => {
    const response = await fetch("/products");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchAllCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch("/category");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchAllBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch("/brands");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchProductByFilters(filter, sort, pagination, admin) {
  let queryString = "";
  console.log(filter, sort);
  for (let key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.length > 0) {
      const lastCategory = categoryValues[categoryValues.length - 1];
      queryString += `${key}=${lastCategory}&`;
    }
  }

  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  console.log(pagination);
  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  if (admin) {
    queryString += `admin=true`;
  }
  console.log("/products?" + queryString);
  return new Promise(async (resolve) => {
    const response = await fetch("/products?" + queryString);
    const data = await response.json();
    const totalItems = await response.headers.get("X-Total-Count");
    resolve({ data: { products: data, totalItems: totalItems } });
  });
}

export function fetchProductById(id) {
  return new Promise(async (resolve) => {
    console.log("Api");
    const response = await fetch(`/products/` + id);
    const data = await response.json();
    resolve({ data });
  });
}

export function createProduct(product) {
  return new Promise(async (resolve) => {
    console.log("Api");
    const response = await fetch(`/products/`, {
      method: "POST",
      body: JSON.stringify(product),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}
export function updateProduct(product) {
  return new Promise(async (resolve) => {
    console.log("Api");
    const response = await fetch(`/products/` + product.id, {
      method: "PATCH",
      body: JSON.stringify(product),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}
export function deleteProduct(productId) {
  return new Promise(async (resolve) => {
    console.log("Api");
    const response = await fetch(`/products/` + productId, {
      method: "DELETE",
    });
    resolve({ success: true });
  });
}
