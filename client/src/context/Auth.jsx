import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "../../api/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  async function login(user_credentials) {
    try {
      const { data } = await axios.post(`/users/signin`, user_credentials, {
        headers: { "Content-Type": "application/json" },
      });

      if (data) {
        const { token, user } = data;
        setToken(token);
        setUser(user);
      }

      return data;
    } catch (error) {
      console.error("Error logging in user.", error);
    }
  }

  async function logout() {
    try {
      await axios.post("/users/signout", {
        headers: { "Content-Type": "application/json" },
      });
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Error logging out.", error);
    }
  }

  async function signUp(user_credentials) {
    try {
      const { data } = await axios.post("/users/signup", user_credentials, {
        headers: { "Content-Type": "application/json" },
      });

      return data;
    } catch (error) {
      console.error("Error signing up new user.", error);
    }
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const contextValue = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      signUp,
    }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
