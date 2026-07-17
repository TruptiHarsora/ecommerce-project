import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import useCart from '@/hooks/useCart'
import useOrder from '@/hooks/useOrder';
import checkoutValidationSchema from '@/validators/checkoutValidator';
import { useFormik } from 'formik';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const Checkout = () => {
  const { items: cartItems = [], pricing = {}, fetchCart } = useCart();
  const { createOrder, loading } = useOrder();
  const navigate = useNavigate();

  const location = useLocation();

  const buyNowItems =
    location.state?.buyNow
      ? location.state.items
      : null;

  const items = buyNowItems || cartItems;

  console.log("Chekout itms", items);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India"
    },
    validationSchema: checkoutValidationSchema,

    onSubmit: async (values) => {
      // console.log("values:", values);
      try {
        const payload = {
          items: items.map((item) => ({
            product: item.product._id,
            seller: item.seller?._id,
            variantSku: item.variantSku,
            variantImg: item.variantImg,
            quantity: item.quantity
          })),
          shippingAddress: {
            ...values, country: "India"
          },
          paymentInfo: { method: "cod" }
        };

        // console.log("Order Paylod:", payload);

        const res = await createOrder(payload);
        // console.log("res order", res);

        await fetchCart();

        formik.resetForm();

        navigate("/order-success", {
          state: {
            orderId: res.order._id
          }
        });

      } catch (error) {
        console.log(error);
      }
    }
  });

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-In", {
      style: "currency",
      currency: "INR"
    })
  }

  if (!items.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-semibold">
          Your cart is empty
        </h2>

        <p className="text-muted-foreground">
          Add some products before checkout.
        </p>

        <Link to="/products">
          <Button>
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div className='min-h-screen bg-muted/40 p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid lg:grid-cols-3 gap-6'>

          {/* //shipping address form  */}

          <div className='lg:col-span-2'>
            <form className='space-y-6' onSubmit={formik.handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Shipping Address
                  </CardTitle>
                </CardHeader>

                <CardContent className='space-y-5'>

                  <div className='space-y-2'>
                    <Label>Full Name</Label>
                    <Input type="text" name="fullName"
                      placeholder="Amit Dave"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                      <p className='text-sm text-red-500'>
                        {formik.errors.fullName}
                      </p>
                    )
                    }
                  </div>

                  <div className='space-y-2'>
                    <Label>Phone Number</Label>
                    <Input type="text" name="phone"
                      placeholder="9876543210"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {
                      formik.touched.phone && formik.errors.phone && (
                        <p className='text-red-500 text-sm'>
                          {formik.errors.phone}
                        </p>
                      )
                    }
                  </div>

                  <div className='space-y-2'>
                    <Label>Address Line 1</Label>
                    <Input type="text" name="addressLine1"
                      placeholder="House No, Street, Area"
                      value={formik.values.addressLine1}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {
                      formik.touched.addressLine1 && formik.errors.addressLine1 && (
                        <p className='text-red-500 text-sm'>
                          {formik.errors.addressLine1}
                        </p>
                      )
                    }
                  </div>

                  <div className='space-y-2'>
                    <Label>Address Line 2</Label>
                    <Input type="text" name="addressLine2"
                      placeholder="Apartment, Landmark (Optional)"
                      value={formik.values.addressLine2}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {
                      formik.touched.addressLine2 && formik.errors.addressLine2 && (
                        <p className='text-red-500 text-sm'>
                          {formik.errors.addressLine2}
                        </p>
                      )
                    }
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">

                    <div className="space-y-2">
                      <Label>City</Label>

                      <Input
                        type="text"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.city &&
                        formik.errors.city && (
                          <p className="text-sm text-red-500">
                            {formik.errors.city}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label>State</Label>

                      <Input
                        type="text"
                        name="state"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.state &&
                        formik.errors.state && (
                          <p className="text-sm text-red-500">
                            {formik.errors.state}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label>Postal Code</Label>

                      <Input
                        type="text"
                        name="postalCode"
                        value={formik.values.postalCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.postalCode &&
                        formik.errors.postalCode && (
                          <p className="text-sm text-red-500">
                            {formik.errors.postalCode}
                          </p>
                        )}
                    </div>

                    {/* <div className="space-y-2">
                      <Label>Country</Label>

                      <Input
                        type="text"
                        name="country"
                        placeholder="India"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.country &&
                        formik.errors.country && (
                          <p className="text-sm text-red-500">
                            {formik.errors.country}
                          </p>
                        )}
                    </div> */}


                    <div className="space-y-2">
                      <Label>Country</Label>

                      <Input
                        name="country"
                        value={formik.values.country}
                        disabled
                      />
                    </div>

                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className='border rounded-lg p-4'>
                    <label className="flex items-center gap-2">
                      <input type="radio" checked readOnly />
                      Cash On Delivery (COD)
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* <Button type="submit" className="w-full h-12"
                disabled={loading.create}>
                {
                  loading.create
                    ? "Placing order..."
                    : "place Order"
                }

              </Button> */}

              <pre>
                {JSON.stringify(formik.errors, null, 2)}
              </pre>
              {/* <Button
                type="submit"
                onClick={() => {
                  console.log("Button Clicked");
                  console.log("Errors:", formik.errors);
                  console.log("Values:", formik.values);
                }}
              >
                Place Order
              </Button> */}

              <Button
                type="submit"
                disabled={
                  loading.create ||
                  items.length === 0
                }
              > {
                  loading.create
                    ? "Placing order..."
                    : "place Order"
                }</Button>
            </form>
          </div>

          {/* Form Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span>
                    {formatPrice(pricing.itemTotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>CGST</span>
                  <span>
                    {formatPrice(pricing.cgst)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>SGST</span>
                  <span>
                    {formatPrice(pricing.sgst)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {formatPrice(pricing.shipping)}
                  </span>
                </div>
                <hr />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>
                    {formatPrice(pricing.grandTotal)}
                  </span>
                </div>

                <hr />

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="border-b pb-3 last:border-0"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-2">
                            {item.product?.title}
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <span className="font-semibold">
                          {formatPrice(
                            item.priceAtTime * item.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>


          </div>

        </div>

      </div>

    </div>
  )
}

export default Checkout

