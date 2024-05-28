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

export function fetchItemByUserId() {
  return new Promise(async (resolve) => {
    const response = await fetch(
      "http://localhost:8080/cart"
    );
    const data = await response.json();
    resolve({ data });
  });
}
export function updateCart(update) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/cart/" + update._id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}
export function deleteCart(itemId) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/cart/" + itemId, {
      method: "DELETE",
    });
    const data = await response.json();
    resolve({ data });
  });
}
export async function resetCart(userId) {
  try {
    const response = await fetchItemByUserId(userId);
    const items = response.data; // Accessing the data property from the response
    console.log(items);
    for (let item of items) {
      await deleteCart(item.id);
    }
    return { status: "success" }; // Returning a promise resolved with success status
  } catch (error) {
    return { status: "error", message: error.message }; // Returning a promise resolved with error status and message
  }
}
