import React from "react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";

const OrderSuccess = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardContent className="py-10 text-center space-y-6">

          {/* <div className="text-6xl">
            ✅
          </div> */}

          <h2 className="text-3xl font-bold">
            ✅ Order Placed Successfully
          </h2>

          <p className="text-muted-foreground">
            Thank you for your purchase.
            Your order has been received and is being processed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            <Link to="/orders">
              <Button>
                View My Orders
              </Button>
            </Link>

            <Link to="/products">
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>

          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;