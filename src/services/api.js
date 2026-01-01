const API_URL = "http://127.0.0.1:8000";

export const telegram = async (message) => {
  const response = await fetch(`${API_URL}/telegram/send-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message }),
  });
  
  const data = await response.json();
  if(!response.ok) { throw new Error(data.detail || "Message cannot sent"); }
  return data; 
};