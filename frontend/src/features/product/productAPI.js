export function fetchAllProducts() {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/products");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchProductByFilters(filter, sort) {
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
  console.log("http://localhost:8080/products?" + queryString);
  return new Promise(async (resolve) => {
    const response = await fetch(
      "http://localhost:8080/products?" + queryString
    );
    const data = await response.json();
    resolve({ data });
  });
}
