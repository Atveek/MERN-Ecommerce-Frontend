export function createUser(user) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/user", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function checkUser(user) {
  return new Promise(async (resolve, reject) => {
    const email = user.email;
    const password = user.password;
    const response = await fetch(`http://localhost:8080/user?email=${email}`);
    const data = await response.json();
    console.log(data);
    if (data.length) {
      if (password === data[0].password) resolve({ data: data[0] });
      else reject({ message: "wrong credentials " });
    }
    reject({ message: "user not found" });
  });
}

