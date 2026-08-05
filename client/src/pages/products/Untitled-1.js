import { useEffect, useState } from "react";
import useSeller from "@/hooks/useSeller";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import UserAvatar from "@/components/common/UserAvatar";

const SellerProfile = () => {
  const { seller, loading, getSellerProfile, updateSellerProfile } =
    useSeller();

  const [form, setForm] = useState({
    shopName: "",
    gstNumber: "",
    businessPhone: "",
    pickupAddress: {
      addressLine1: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  const [logo, setLogo] = useState(null);

  useEffect(() => {
    getSellerProfile();
  }, []);

  useEffect(() => {
    if (seller) {
      setForm({
        shopName: seller.shopName || "",
        gstNumber: seller.gstNumber || "",
        businessPhone: seller.businessPhone || "",
        pickupAddress: {
          addressLine1: seller.pickupAddress?.addressLine1 || "",
          city: seller.pickupAddress?.city || "",
          state: seller.pickupAddress?.state || "",
          postalCode: seller.pickupAddress?.postalCode || "",
        },
      });
    }
  }, [seller]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "addressLine1" ||
      name === "city" ||
      name === "state" ||
      name === "postalCode"
    ) {
      setForm((prev) => ({
        ...prev,
        pickupAddress: {
          ...prev.pickupAddress,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("shopName", form.shopName);
    formData.append("gstNumber", form.gstNumber);
    formData.append("businessPhone", form.businessPhone);

    formData.append("pickupAddress", JSON.stringify(form.pickupAddress));

    if (logo) {
      formData.append("logo", logo);
    }

    updateSellerProfile(formData);
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Seller Profile</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-10">
            {/* Left */}

            <div className="space-y-5 flex flex-col items-center">
              <UserAvatar
                image={seller?.logo}
                name={seller?.shopName}
                size="w-40 h-40"
                textSize="text-4xl"
              />

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files[0])}
              />

              <p className="text-xs text-muted-foreground">
                JPG, PNG (Max 5MB)
              </p>
            </div>

            {/* Right */}

            <div className="md:col-span-2 space-y-5">
              <div>
                <Label>Shop Name</Label>
                <Input
                  name="shopName"
                  value={form.shopName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>GST Number</Label>
                <Input
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Business Phone</Label>
                <Input
                  name="businessPhone"
                  value={form.businessPhone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Address Line</Label>
                <Input
                  name="addressLine1"
                  value={form.pickupAddress.addressLine1}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>City</Label>
                  <Input
                    name="city"
                    value={form.pickupAddress.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>State</Label>
                  <Input
                    name="state"
                    value={form.pickupAddress.state}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Postal Code</Label>
                  <Input
                    name="postalCode"
                    value={form.pickupAddress.postalCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerProfile;
