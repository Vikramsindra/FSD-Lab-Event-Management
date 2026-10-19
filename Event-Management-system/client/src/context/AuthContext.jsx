import { useState } from "react";
import { AuthContext } from "./authContext";

function readStoredUser() {
  try {
    const value = localStorage.getItem("eventHubUser");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  function saveUser(loggedInUser) {
    setUser(loggedInUser);
    try {
      localStorage.setItem("eventHubUser", JSON.stringify(loggedInUser));
    } catch {
      // Keep the current session active if browser storage is unavailable.
    }
  }

  function login(email) {
    const userEmail = typeof email === "string" ? email : email?.email;
    if (!userEmail) throw new Error("Enter an email address to sign in.");

    const loggedInUser = {
      name: userEmail.split("@")[0],
      email: userEmail,
    };
    saveUser(loggedInUser);
    return loggedInUser;
  }

  function register(details) {
    const userEmail = details?.email;
    if (!userEmail) throw new Error("Enter an email address to register.");

    const loggedInUser = {
      name: details.name || userEmail.split("@")[0],
      email: userEmail,
    };
    saveUser(loggedInUser);
    return loggedInUser;
  }

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem("eventHubUser");
    } catch {
      // The in-memory session is still cleared if browser storage is unavailable.
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
