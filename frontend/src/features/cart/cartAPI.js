export function addToCart(item) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/cart", {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchItemByUserId(userId) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      "http://localhost:8080/cart?user.id=" + userId
    );
    const data = await response.json();
    resolve({ data });
  });
}
export function updateCart(update, userId) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      "http://localhost:8080/cart/" + update.id + "?user.id=" + userId,
      {
        method: "PATCH",
        body: JSON.stringify(update),
        headers: { "content-type": "application/json" },
      }
    );
    const data = await response.json();
    resolve({ data });
  });
}
export function deleteCart(itemId, userId) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      "http://localhost:8080/cart/" + itemId + "?user.id=" + userId,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    resolve({ data });
  });
}
