import React, { useContext } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/AuthContext";
import { useFormik } from "formik";
import { registerSchema } from "@/validators/authValidator";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        await register(values);
        nav("/login");
      } catch (error) {
        setStatus(error?.response?.data?.message || "somthing went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleChange = (e) => {
    formik.handleChange(e);
    formik.setStatus(null);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,10}$/.test(value)) {
      formik.setFieldValue("phone", value);
      formik.setStatus(null);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Create your account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            {/* Name */}
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formik.values.name}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm text-center">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formik.values.email}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm text-center">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Create password"
                name="password"
                value={formik.values.password}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm text-center">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            {/* <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="Confirm password" />
            </div> */}

            <div className="space-y-x">
              <Label>Mobile number</Label>
              {/* <Input type="Number"
                placeholder="Enter your mobile number"
                name="phone"
                value={formik.values.phone}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setStatus(null);
                }}
                onBlur={formik.handleBlur}
              /> */}

              <Input
                type="tel"
                name="phone"
                maxLength={10}
                inputMode="numeric"
                value={formik.values.phone}
                onChange={handlePhoneChange}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm text-center">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            {/* Terms
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">
                I agree to the terms and conditions
              </Label>
            </div> */}

            {formik.status && (
              <p className="text-red-500 text-sm text-center">
                {formik.status}
              </p>
            )}

            {/* Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Signing is ...." : "sing up"}
              {/* Sign Up */}
            </Button>

            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
