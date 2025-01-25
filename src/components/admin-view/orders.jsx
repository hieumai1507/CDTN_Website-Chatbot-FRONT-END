import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { useEffect, useState } from "react";
import AdminOrdersDetailsView from "./order-details";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
function AdminOrdersView() {
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrders);
  const dispatch = useDispatch();
  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
    setIsFirstLoad(false);
  }
  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);
  useEffect(() => {
    if (!isFirstLoad && orderDetails !== null) {
      setOpenDetailDialog(true);
    }
  }, [orderDetails, isFirstLoad]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600"
                            : "bg-black"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailDialog}
                        onOpenChange={setOpenDetailDialog}
                      >
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          ViewDetail
                        </Button>
                        <AdminOrdersDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
