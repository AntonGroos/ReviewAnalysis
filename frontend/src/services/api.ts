import axios from "axios";

// Define the base API URL
const API_BASE_URL = "http://localhost:8000";

// Create an Axios instance (optional but useful)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to send reviews to the backend
export const sendReviewsToBackend = async (reviews) => {
  try {
    const response = await apiClient.post("/reviews/", reviews);
    console.log("Server Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending reviews:", error);
    throw error;
  }
};

export const sendPlacesToBackend = async (places) => {
  try {
    const response = await apiClient.post("/places/", places);
    console.log("Server Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending places:", error);
    throw error;
  }
};
