import useAuth from "@/hooks/useAuth";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import updateUserProfileSchema from "@/validators/userValidator";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const UserChangePasswordForm = ({
  initialValues,
  onSubmit,
  changePassword,
  avtarUrl,
  userName,
}) => {
  const [preview, setPriview] = useState(avtarUrl || null);
  const [PasswordChange, setPasswordChange] = useState(false);
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={updateUserProfileSchema}
      onSubmit={onSubmit}
      changePassowrd={changePassword}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <div>
          <Form>
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="p-6 flex flex-col items-center justifiy-center gap-4">
                <Label className="text-lg">Profile</Label>
                <div className="w-44 h-44 rounded-lg overflow-hidden border bg-muted">
                  {preview ? (
                    <img
                      src={preview}
                      alt="profile images"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center rounded-lg bg-indigo-500 text-white text-6xl font-bold">
                      {(
                        values.name?.trim()?.charAt(0) ||
                        userName?.trim()?.charAt(0) ||
                        "S"
                      ).toUpperCase()}
                    </div>
                  )}
                </div>

                <Input
                  type="file"
                  accept="images/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    // console.log(file);
                    if (!file) return;
                    setFieldValue("avtar", file);
                    setPriview(URL.createObjectURL(file));
                  }}
                />
              </Card>

              <Card className={"lg:col-span-2 p-6"}>
                <div className="space-y-5">
                  <div>
                    <Label>User Name</Label>
                    <Field as={Input} name="name" />
                    {touched.name && errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <Field as={Input} name="phone" />
                    {touched.phone && errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>

                  <Button
                    className="w-full mt-5 bg-yellow-100 text-yellow-700 border-yellow-700 hover:bg-yellow-200"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </div>
              </Card>
            </div>
          </Form>

          <Form>
            <Card>
              <CardContent>
                <div>
                  <div>
                    <Label>Current Password</Label>
                    <Field as={Input} name="currentPassword" />
                    {touched.currentPassword && errors.currentPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>New Password</Label>
                    <Field as={Input} name="newPassword" />
                    {touched.newPassword && errors.newPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Confirm Password</Label>
                    <Field as={Input} name="confirmPassword" />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <Button
                    className="w-full mt-5 bg-yellow-100 text-yellow-700 border-yellow-700 hover:bg-yellow-200"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default UserChangePasswordForm;
