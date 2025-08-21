import { apiUrl } from "@/config";
import Axios from "axios";

export const axios = Axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export const register = async (payload) => {
  try {
    const { data } = await axios.post("/auth/signup", payload);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = async (payload) => {
  try {
    const { data } = await axios.post("/auth/signin", payload);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await Axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
    window.location.href = "/login";
  } catch (error) {
    console.log(error);
  }
};

export const createMessage = async (payload) => {
  try {
    const { data } = await axios.post("/messages", payload);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const { data } = await axios.get(
      `/messages/conversation/${conversationId}`
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getResponseAndUpdateMessage = async (id) => {
  try {
    const { data } = await axios.patch(`/messages/response/${id}`, {});
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createConversation = async (payload) => {
  try {
    const { data } = await axios.post("/conversations", payload);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserConversations = async () => {
  try {
    const { data } = await axios.get("/conversations");
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateConversation = async (payload) => {
  try {
    const { data } = await axios.patch(`/conversations/${payload.id}`, payload);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
