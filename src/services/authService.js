import api from "./api";

const authService = {
  login: async (credentials) => {
    const res = await api.post("/api/Auth/login", credentials);
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post("/api/Auth/register", userData);
    return res.data;
  },
};

export default authService;
