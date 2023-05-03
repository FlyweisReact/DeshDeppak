/** @format */

import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import HOC from "../../layout/HOC";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

// Edit Order Modal ------------------------------------------------------------

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Edit Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Delivered</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>delivery Status</option>
              <option value="1">Yes</option>
              <option value="2">No</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Order Status</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Order Status</option>
              <option value="1">Confirmed</option>
              <option value="2">Denied</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Payment Stsua</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Payment Status</option>
              <option value="1">Success</option>
              <option value="2">Pending</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

// Edit Order Modal Ends Here ---------------------------------------------------

const TimeSlots = () => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  // Admin Token
  const token = localStorage.getItem("VendorToken");
  const Auth = { headers: { Authorization: `Bearer ${token} ` } };

  // Fetch Orders
  const Orders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://desh-deepak-backend.herokuapp.com/api/v1/vender/orders",
        Auth
      );
      setLoading(false);
      setData(data);
    } catch (err) {
      console.log(err);
      toast.error("Network issue");
      setLoading(false);
    }
  };

  useEffect(() => {
    Orders();
  }, [axios, toast]);

  //------------------------------------------------------------------

  return (
    <>
      {/* ------------------------------------------------------------- */}

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      {/* ------------------------------------------------------------- */}

      <section>
        <div className="pb-4 sticky top-0  w-full flex justify-between items-center bg-white">
          <span className="tracking-widest text-slate-900 font-semibold uppercase ">
            All Orders
          </span>
        </div>
        {/* Add Form */}

        <div style={{ maxWidth: "100%", overflow: "auto" }}>
          <Table style={{ paddingTop: "5%", textAlign: "center" }}>
            <thead>
              <tr className=" border-b bg-green-300 shadow-xl text-gray-900">
                <th>Product Image</th>
                <th>Product Name</th>
                <th>User Name</th>
                <th>Discount</th>
                <th>Quantity</th>
                <th>Shipping Price</th>
                <th> Total</th>
                <th>Grand Total</th>
                <th>Payment Status</th>
                <th>Order status</th>
                <th>Delivered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((i, index) => (
                <tr key={index} style={{ marginTop: "1%" }}>
                  <td>
                    <img
                     src="https://www.eps.org/global_graphics/default-store-350x350.jpg"
                      className="img-fluid img-thumbnail"
                    />
                  </td>
                  <td>{i.product}</td>
                  <td> {i.User}</td>
                  <td> {i.discount}%</td>
                  <td> {i.quantity}</td>
                  <td> ₹{i.shippingPrice}</td>
                  <td> ₹{i.total}</td>
                  <td> ₹{i.grandTotal}</td>
                  <td> {i.payment}</td>
                  <td> {i.orderStatus}</td>
                  <td> {i.deliverd}</td>

                  <td>
                    <span style={{ display: "flex", gap: "5px" }}>
                      <AiFillEdit
                        color="blue"
                        cursor="pointer"
                        onClick={() => setModalShow(true)}
                      />
                      {/* <AiFillEye
                        cursor="pointer"
                        onClick={() => navigate("/viewProduct")}
                      /> */}
                      <AiFillDelete color="red" cursor="pointer" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>
    </>
  );
};

export default HOC(TimeSlots);
