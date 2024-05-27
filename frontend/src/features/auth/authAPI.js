export function createUser(user) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/auth/signup", {
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
    try {
      const response = await fetch(`http://localhost:8080/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username: user.email, password: user.password }),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const err = await response.json();
        reject({ err });
      }
    } catch (err) {
      reject({ err });
    }
  });
}
export function SignOut() {
  return new Promise(async (resolve, reject) => {
    // const response = await fetch(`http://localhost:8080/user/${userId}`);
    // const data = await response.json();

    //TODO:  server we will remove user session info
    resolve({ data: "success" });
  });
}
