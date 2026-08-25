// import { createContext, useState, useEffect } from "react";
// import { getToken, removeToken, setToken } from "../utils/token";
// import {
//   changePassword,
//   getProfile,
//   loginUser,
//   logoutUser,
//   registerUser,
//   updateProfile,
//   getMe,
// } from "../services/authService";
// import { successToast } from "@/lib/toast";

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const login = async (payload) => {
//     try {
//       //  console.log("paylod", payload);
//       setLoading(true);

//       const data = await loginUser(payload);
//       // console.log("provider login", data);

//       if (!data?.accessToken || !data?.user) {
//         throw new Error("Invalid responce from server");
//       }

//       setToken(data.accessToken);
//       setUser(data.user);
//       successToast(data.message);
//       return data;
//     } catch (error) {
//       // console.log("LoginUser error", error);
//       throw error;
//       // const message =
//       //     error?.response?.data?.message ||
//       //     "Something went wrong";

//       // throw new Error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (payload) => {
//     try {
//       setLoading(true);

//       const data = await registerUser(payload);
//       // console.log("provider register: ", data);
//       successToast(data.message);
//       return data;
//     } catch (error) {
//       // console.log("register error", error);
//       const message = error?.response?.data?.message || "Something went wrong";

//       throw new Error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       setLoading(true);

//       const data = await logoutUser();
//       // console.log("Provider logout", data);
//       successToast(data.message);
//       return data;
//     } catch (error) {
//       console.log("logout Error: ", error);
//     } finally {
//       removeToken();
//       setUser(null);
//       setLoading(false);
//     }
//   };

//   const fetchUserProfile = async (payload) => {
//     try {
//       setLoading(true);

//       const token = getToken();
//       if (!token) {
//         throw new Error("No token found");
//       }

//       const data = await getProfile();
//       if (!data?.user) {
//         throw new Error("Invalid profile response");
//       }

//       setUser(data.user);
//       //  console.log("Provider user Profile: ", data);

//       return data;
//     } catch (error) {
//       console.log("userProfile error", error);
//       setUser(null);
//       removeToken();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateUserProfile = async (payload) => {
//     try {
//       setLoading(true);

//       const data = await updateProfile(payload);
//       // console.log("Provider user Profile: ", data);

//       setUser(data.user);
//       return data;
//     } catch (error) {
//       // console.log("updateUserProfile error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateUserPassword = async (payload) => {
//     try {
//       setLoading(true);

//       const data = await changePassword(payload);
//       //  console.log("Provider changePassword: ", data);

//       return data;
//     } catch (error) {
//       // console.log("updatePassword error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMeData = async () => {
//     try {
//       // console.log("paylod", payload);
//       setLoading(true);

//       const data = await getMe();
//       // console.log("getMe login", data);

//       if (!data?.user) {
//         throw new Error("Invalid responce from server");
//       }

//       // setToken(data.accessToken);
//       setUser(data.user);
//       // successToast(data.message);
//       return data;
//     } catch (error) {
//         console.log("getMe error", error);
//       throw error;
//       // const message =
//       //     error?.response?.data?.message ||
//       //     "Something went wrong";

//       // throw new Error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // useEffect(() => {
//   //   const token = getToken();

//   //   if (token) {
//   //     fetchUserProfile();
//   //   }
//   // }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         register,
//         logout,
//         fetchUserProfile,
//         updateUserProfile,
//         updateUserPassword,
//         getMeData,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

import { createContext, useEffect, useState } from "react";
import { getToken, removeToken, setToken } from "../utils/token";

import {
  changePassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "../services/authService";

import { successToast } from "@/lib/toast";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (payload) => {
    try {
      setLoading(true);

      const data = await loginUser(payload);

      if (!data?.accessToken || !data?.user) {
        throw new Error("Invalid response from server");
      }

      setToken(data.accessToken);
      setUser(data.user);

      successToast(data.message);

      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (payload) => {
    try {
      setLoading(true);

      const data = await registerUser(payload);

      successToast(data.message);

      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {
    try {
      setLoading(true);

      const data = await logoutUser();

      successToast(data.message);

      return data;
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      removeToken();
      setUser(null);
      setLoading(false);
    }
  };

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const getMeData = async () => {
    try {
      const token = getToken();

      if (!token) {
        setUser(null);
        return null;
      }

      const data = await getMe();

      if (!data?.user) {
        throw new Error("Invalid user response");
      }

      setUser(data.user);

      return data;
    } catch (error) {
      console.error("getMe error:", error);

      setUser(null);
      removeToken();

      return null;
    }
  };

  // ==========================================
  // INITIAL AUTH CHECK
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const token = getToken();

        // No token = user is not logged in
        if (!token) {
          if (mounted) {
            setUser(null);
          }

          return;
        }

        // IMPORTANT:
        // Wait until server returns the current user
        const data = await getMe();

        console.log("========== GET ME ==========");
        console.log("GET ME RESPONSE:", data);
        console.log("USER:", data?.user);
        console.log("ROLE:", data?.user?.role);
        console.log("IS VERIFIED:", data?.user?.isVerified);
        console.log("============================");

        if (!mounted) return;

        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
          removeToken();
        }
      } catch (error) {
        console.error("INITIAL AUTH ERROR:", error);

        if (mounted) {
          setUser(null);
        }

        removeToken();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const updateUserProfile = async (payload) => {
    try {
      setLoading(true);

      const data = await updateProfile(payload);

      if (data?.user) {
        setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const updateUserPassword = async (payload) => {
    try {
      setLoading(true);

      const data = await changePassword(payload);

      return data;
    } catch (error) {
      console.error("Update password error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        login,
        register,
        logout,

        getMeData,

        updateUserProfile,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
