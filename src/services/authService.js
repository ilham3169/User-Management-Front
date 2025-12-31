const API_URL = "http://127.0.0.1:8000/auth";

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password_hash: password, 
    }),
  });
  
  const data = await response.json();
  if(!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data; 
};

export const update_login = async (username) => {
  await fetch(`http://127.0.0.1:8000/auth/last_login/${username}`, { 
    method: "PATCH" 
  });
}