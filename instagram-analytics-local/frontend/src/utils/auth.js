const API = "http://127.0.0.1:5000/api";

export async function signupUser(data) {
  const res = await fetch(`${API}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const payload = await res.json();
  if (!res.ok) {
    return { error: payload?.error || "Signup failed" };
  }
  return payload;
}

export async function loginUser(data) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const payload = await res.json();
  if (!res.ok) {
    return { error: payload?.error || "Login failed" };
  }
  localStorage.setItem("insta_user", JSON.stringify(payload));
  return payload;
}

export function logoutUser() {
  localStorage.removeItem("insta_user");
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("insta_user"));
}

export function isLoggedIn() {
  return !!getCurrentUser();
}
