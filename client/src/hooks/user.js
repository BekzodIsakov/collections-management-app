import axios from "axios";
import React from "react";
import { useAuth } from "../providers/authProvider";
import { useLocation, useParams } from "react-router-dom";

export const useUserSignIn = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  async function onSignIn(userCredentails) {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_DEV_URL}/users/signin`,
        userCredentails,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setData(response.data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, errorMessage, onSignIn };
};

export const useUserSignUp = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  async function onSignUp(userCredentails) {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_DEV_URL}/users/signup`,
        userCredentails,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setData(response.data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, errorMessage, onSignUp };
};

export const useUserSignOut = () => {
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  async function onSignOut() {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_DEV_URL}/users/signout`, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, errorMessage, onSignOut };
};

export const useFetchUser = () => {
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [user, setUser] = React.useState(null);

  const location = useLocation();
  const userPath = location.pathname.split("/")[1];
  const params = useParams();

  const { setUser: setCurrentUser, user: currentUser } = useAuth();

  async function fetchUser() {
    const path = userPath === "me" ? "me" : params.userId;
    try {
      setLoading(true);
      const result = await axios.get(
        `${import.meta.env.VITE_DEV_URL}/users/${path}`
      );
      setUser(result.data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (userPath === "me" && user) {
      const _currentUser = {
        ...currentUser,
        name: user.name,
        isAdmin: user.isAdmin,
      };
      setCurrentUser(_currentUser);
    }
  }, [user]);

  return { loading, errorMessage, user, fetchUser };
};

export const useFetchUsers = () => {
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [users, setUsers] = React.useState([]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_DEV_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return { users, loading, errorMessage, fetchUsers };
};
