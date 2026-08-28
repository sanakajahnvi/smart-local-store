/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "smartstore_auth";
const USERS_STORAGE_KEY = "smartstore_users";


// ============================================================
// STORAGE HELPERS
// ============================================================

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch {
    return fallback;
  }
}


function saveJson(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch {
    // Ignore localStorage errors
  }
}


// ============================================================
// USER NORMALIZATION
// ============================================================

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id:
      user.id ||
      user.userId ||
      user.email,

    name:
      user.name ||
      user.fullName ||
      "SmartStore User",

    email:
      user.email ||
      "",

    phone:
      user.phone ||
      user.mobile ||
      "",

    dateOfBirth:
      user.dateOfBirth ||
      "",

    gender:
      user.gender ||
      "",

    role: String(
      user.role ||
        user.userRole ||
        "CUSTOMER"
    ).toUpperCase(),
  };
}


// ============================================================
// SAVED USER
// ============================================================

function getSavedUser() {
  const savedUser = readJson(
    AUTH_STORAGE_KEY,
    null
  );

  return normalizeUser(savedUser);
}


// ============================================================
// USERS
// ============================================================

function getUsers() {
  const users = readJson(
    USERS_STORAGE_KEY,
    []
  );

  return Array.isArray(users)
    ? users
    : [];
}


function saveUsers(users) {
  saveJson(
    USERS_STORAGE_KEY,
    users
  );
}


// ============================================================
// AUTH PROVIDER
// ============================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    getSavedUser
  );

  const [loading, setLoading] =
    useState(false);


  // ==========================================================
  // SAVE LOGIN STATE
  // ==========================================================

  useEffect(() => {
    if (user) {
      saveJson(
        AUTH_STORAGE_KEY,
        user
      );
    } else {
      try {
        localStorage.removeItem(
          AUTH_STORAGE_KEY
        );
      } catch {
        // Ignore
      }
    }
  }, [user]);


  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (
    email,
    password
  ) => {
    setLoading(true);

    try {
      const cleanEmail =
        String(email || "")
          .trim()
          .toLowerCase();

      if (!cleanEmail) {
        throw new Error(
          "Please enter your email address."
        );
      }

      if (!password) {
        throw new Error(
          "Please enter your password."
        );
      }

      const users = getUsers();

      const foundUser = users.find(
        (item) =>
          String(
            item?.email || ""
          )
            .trim()
            .toLowerCase() ===
            cleanEmail &&
          item?.password === password
      );

      if (!foundUser) {
        throw new Error(
          "Invalid email or password."
        );
      }

      const safeUser =
        normalizeUser(foundUser);

      setUser(safeUser);

      return safeUser;
    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // REGISTER
  // ==========================================================

  const register = async (data) => {
    setLoading(true);

    try {
      const name =
        String(
          data?.name ||
            data?.fullName ||
            ""
        ).trim();

      const email =
        String(
          data?.email || ""
        )
          .trim()
          .toLowerCase();

      const password =
        String(
          data?.password || ""
        );

      const phone =
        String(
          data?.phone ||
            data?.mobile ||
            ""
        ).trim();


      // ------------------------------------------------------
      // VALIDATION
      // ------------------------------------------------------

      if (!name) {
        throw new Error(
          "Please enter your name."
        );
      }

      if (!email) {
        throw new Error(
          "Please enter your email."
        );
      }

      if (!password) {
        throw new Error(
          "Please enter a password."
        );
      }

      if (password.length < 6) {
        throw new Error(
          "Password must contain at least 6 characters."
        );
      }


      // ------------------------------------------------------
      // CHECK EXISTING ACCOUNT
      // ------------------------------------------------------

      const users = getUsers();

      const alreadyExists =
        users.some(
          (item) =>
            String(
              item?.email || ""
            )
              .trim()
              .toLowerCase() ===
            email
        );

      if (alreadyExists) {
        throw new Error(
          "An account with this email already exists."
        );
      }


      // ------------------------------------------------------
      // CREATE USER
      // ------------------------------------------------------

      const newUser = {
        id:
          `customer-${Date.now()}`,

        name,

        email,

        password,

        phone,

        dateOfBirth:
          data?.dateOfBirth ||
          "",

        gender:
          data?.gender ||
          "",

        role: "CUSTOMER",
      };


      saveUsers([
        ...users,
        newUser,
      ]);


      const safeUser =
        normalizeUser(newUser);


      setUser(safeUser);

      return safeUser;
    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // UPDATE USER
  // ==========================================================

  const updateUser = (
    changes = {}
  ) => {
    setUser(
      (currentUser) => {
        if (!currentUser) {
          return currentUser;
        }

        const updatedUser =
          normalizeUser({
            ...currentUser,
            ...changes,
          });


        const users = getUsers();


        const updatedUsers =
          users.map(
            (item) =>
              String(
                item?.id
              ) ===
              String(
                currentUser.id
              )
                ? {
                    ...item,
                    ...changes,
                  }
                : item
          );


        saveUsers(
          updatedUsers
        );


        saveJson(
          AUTH_STORAGE_KEY,
          updatedUser
        );


        return updatedUser;
      }
    );
  };


  // ==========================================================
  // CHANGE PASSWORD
  // ==========================================================

  const changePassword = (
    currentPassword,
    newPassword
  ) => {
    if (!user) {
      throw new Error(
        "Please sign in first."
      );
    }

    if (
      !currentPassword ||
      !newPassword
    ) {
      throw new Error(
        "Please enter both passwords."
      );
    }

    if (newPassword.length < 6) {
      throw new Error(
        "New password must contain at least 6 characters."
      );
    }


    const users = getUsers();


    const currentUser =
      users.find(
        (item) =>
          String(
            item?.id
          ) ===
          String(
            user.id
          )
      );


    if (!currentUser) {
      throw new Error(
        "Account could not be found."
      );
    }


    if (
      currentUser.password !==
      currentPassword
    ) {
      throw new Error(
        "Current password is incorrect."
      );
    }


    const updatedUsers =
      users.map(
        (item) =>
          String(
            item?.id
          ) ===
          String(
            user.id
          )
            ? {
                ...item,
                password:
                  newPassword,
              }
            : item
      );


    saveUsers(
      updatedUsers
    );


    return true;
  };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = () => {
    try {
      localStorage.removeItem(
        AUTH_STORAGE_KEY
      );
    } catch {
      // Ignore
    }

    setUser(null);
  };


  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = {
      user,

      loading,

      isAuthenticated:
        Boolean(user),

      isAdmin:
        user?.role === "ADMIN",

      login,

      register,

      updateUser,

      changePassword,

      logout,
    };


  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ============================================================
// useAuth
// ============================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}


export default AuthContext;