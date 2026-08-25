import { BrowserRouter, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";

import "react-toastify/dist/ReactToastify.css";

import AuthProvider from "../context/AuthContext";
import store from "../store/store";

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          {children}
          {/* <Outlet /> */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
          />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default Providers;
