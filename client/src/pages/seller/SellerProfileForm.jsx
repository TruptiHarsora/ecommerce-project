import { Formik, Form, Field } from "formik";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";

import { sellerProfileSchema } from "@/validators/sellerValidator";

const SellerProfileForm = ({
  initialValues,
  onSubmit,
  isEdit,
  logoUrl,
  userName,
}) => {
  const [preview, setPreview] = useState(logoUrl || null);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={sellerProfileSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT */}

            <Card className="p-6 flex flex-col items-center justify-center gap-4">
              <Label className="text-lg">Shop Logo</Label>
              <div className="w-44 h-44 rounded-lg overflow-hidden border bg-muted">
                {preview ? (
                  <img
                    // src={preview || values.logo || seller?.logo}
                    src={preview}
                    alt="Shop Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-lg bg-indigo-500 text-white text-6xl font-bold">
                    {(
                      values.shopName?.trim()?.charAt(0) ||
                      userName?.trim()?.charAt(0) ||
                      "S"
                    ).toUpperCase()}
                  </div>
                )}
              </div>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (!file) return;

                  setFieldValue("logo", file);

                  setPreview(URL.createObjectURL(file));
                }}
              />
            </Card>

            {/* RIGHT */}

            <Card className="lg:col-span-2 p-6">
              <div className="space-y-5">
                {/* Shop Name */}

                <div>
                  <Label>Shop Name</Label>

                  <Field as={Input} name="shopName" />

                  {touched.shopName && errors.shopName && (
                    <p className="text-red-500 text-sm">{errors.shopName}</p>
                  )}
                </div>

                {/* GST */}

                <div>
                  <Label>GST Number</Label>

                  <Field as={Input} name="gstNumber" />
                </div>

                {/* Phone */}

                <div>
                  <Label>Business Phone</Label>

                  <Field as={Input} name="businessPhone" />

                  {touched.businessPhone && errors.businessPhone && (
                    <p className="text-red-500 text-sm">
                      {errors.businessPhone}
                    </p>
                  )}
                </div>

                <h3 className="font-semibold border-b pb-2">Pickup Address</h3>

                {/* Address */}

                <div>
                  <Label>Address Line</Label>

                  <Field as={Input} name="pickupAddress.addressLine1" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>City</Label>

                    <Field as={Input} name="pickupAddress.city" />
                  </div>

                  <div>
                    <Label>State</Label>

                    <Field as={Input} name="pickupAddress.state" />
                  </div>
                </div>

                <div>
                  <Label>Postal Code</Label>

                  <Field as={Input} name="pickupAddress.postalCode" />
                </div>

                <Button
                  className="w-full mt-5 bg-yellow-100 text-yellow-700 border-yellow-700 hover:bg-yellow-200"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isEdit ? "Save Changes" : "Become Seller"}
                </Button>
              </div>
            </Card>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SellerProfileForm;
