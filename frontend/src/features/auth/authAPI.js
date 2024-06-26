export function createUser(user) {
  return new Promise(async (resolve) => {
    const response = await fetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function loginUser(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password }),
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
export function checkAuth(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`/auth/check`);
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
    try {
      const response = await fetch(`/auth/logout`);
      if (response.ok) {
        resolve({ data: "success" });
      } else {
        const err = await response.text();
        reject({ err });
      }
    } catch (err) {
      reject({ err });
    }
  });
}

export function resetPasswordRequest(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`/auth/reset-password-request`, {
        method: "POST",
        body: JSON.stringify({ email }),
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
export function resetPassword(update) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`/auth/reset-password`, {
        method: "POST",
        body: JSON.stringify(update),
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
