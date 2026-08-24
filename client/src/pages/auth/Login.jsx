import React, { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import { loginSchema } from "@/validators/authValidator";
import useAuth from "@/hooks/useAuth";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { user } = useAuth();
  // const [user, setUser] = useState({
  //   email: "",
  //   password: ""
  // })
  // const [error, setError] = useState("");
  const nav = useNavigate();

  // console.log("user", user);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      console.log("Login clicked");

      console.log("values", values);
      try {
        setStatus(null);
        const data = await login(values);

        switch (data.user.role) {
          case "admin":
            nav("/admin");
            break;

          case "seller":
            nav("/seller");
            break;

          default:
            nav("/");
        }
      } catch (error) {
        setStatus(error?.response?.data?.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // const handleChange = ((e) => {
  //   setUser({ ...user, [e.target.name]: e.target.value });
  // })

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   // const formData = new FormData();

  //   // formData.append("email", user.email);
  //   // formData.append("password", user.password);
  //   // console.log("formdata", formData);
  //   try {
  //     await login(user);
  //     nav("/");
  //   } catch (err) {
  //     setError(err.message);
  //   }

  // }
  // console.log("loging user data", user);

  if (user) {
    nav("/");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Sign in to your account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            {" "}
            {/* onSubmit={handleSubmit} */}
            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                type="email"
                placeholder="Enter your email"
                name="email"
                // onChange={handleChange}
                // value={user.email}
                value={formik.values.email}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setStatus(null);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm text-center">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Password</Label>

              <Input
                type="password"
                placeholder="Enter password"
                name="password"
                // onChange={handleChange}
                // value={user.password}
                value={formik.values.password}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setStatus(null);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
            </div>
            {/* 
            {formik.errors.email && !formik.touched.email && (
              <p className="text-red-500 text-sm text-center">
                {formik.errors.email}
              </p>
            )} */}
            {formik.status && (
              <p className="text-red-500 text-sm text-center">
                {formik.status}
              </p>
            )}
            {/* {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )} */}
            {/*  <div className="flex items-center justify-between">
 
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">
                  Remember me
                </Label>
              </div> 

              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div> */}
            <Button
              type="submit"
              className="w-full"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "loging in ...." : "login"}
              {/* Login */}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
