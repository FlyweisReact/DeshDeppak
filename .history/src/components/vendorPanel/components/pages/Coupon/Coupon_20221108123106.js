/** @format */

import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import HOC from "../../layout/HOC";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spin from "../../../../../Component/Spinner";
import Form from "react-bootstrap/Form";

// Add Coupon Modal ------------------------------------------------------------

function MyVerticallyCenteredModal(props) {
  const [couponCode, setC] = useState("");
  const [activationDate, setA] = useState("");
  const [expirationDate, setE] = useState("");
  const [discount, setD] = useState("");
  const [minOrder, setM] = useState("");

  //Admin Token
  const token = localStorage.getItem("token");

  //Add Coupon

  const addCoupon = async (e) => {
    e.preventDefault();

    const form = {
      couponCode,
      activationDate,
      expirationDate,
      discount,
      minOrder,
    };

    const Auth = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const data = await axios.post(
        "https://desh-deepak-backend.herokuapp.com/api/v1/coupon",
        form,
        Auth
      );
      toast.success("Coupon Added Successfully");

      Coupon();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };
  //------------------------------------------------------------------

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add Coupon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={addCoupon}>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Coupon Code</Form.Label>
            <Form.Control type="text" onChange={(e) => setC(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Activation Date</Form.Label>
            <Form.Control type="date" onChange={(e) => setA(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control type="date" onChange={(e) => setE(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Discount</Form.Label>
            <Form.Control
              type="number"
              placeholder="90"
              min={1}
              onChange={(e) => setD(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Minimum Order</Form.Label>
            <Form.Control
              type="number"
              placeholder="500"
              min={1}
              onChange={(e) => setM(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

// ---------------------------------------------------

const Coupon = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  //Admin Token
  const token = localStorage.getItem("token");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Get all Coupon
  const Coupon = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://desh-deepak-backend.herokuapp.com/api/v1/coupon/all",
        Auth
      );
      setData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Network Issue");
      setLoading(false);
    }
  };
  useEffect(() => {
    Coupon();
  }, [axios, toast, setData]);

  //-------------------------------------------------------------

  // Delete Coupon

  const deleteCoupon = async (id) => {
    try {
      const data = await axios.delete(
        `https://desh-deepak-backend.herokuapp.com/api/v1/coupon/${id}`,
        Auth
      );
      toast.success("Coupon deleted Successfully");
      Coupon();
    } catch (err) {
      console.log(err);
      toast.error("Network Issue");
    }
  };

  //---------------------------------------------------------------

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
            All Coupons
          </span>
          <Button onClick={() => setModalShow(true)} variant="outline-success">
            Add Coupon
          </Button>
        </div>

        <div style={{ maxWidth: "100%", overflow: "auto" }}>
          <Table style={{ paddingTop: "5%" }}>
            <thead>
              <tr className=" border-b bg-green-300 shadow-xl text-gray-900">
                <th>Coupon Code</th>
                <th>Activation Date</th>
                <th>Expiry Date</th>
                <th>Discount</th>
                <th>Minimum Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading ? (
              <Spin />
            ) : (
              <tbody>
                {data?.coupons?.map((i, index) => (
                  <tr key={index} style={{ marginTop: "1%" }}>
                    <td> {i.couponCode} </td>
                    <td> {i.activationDate?.slice(0, 10)} </td>
                    <td> {i.expirationDate?.slice(0, 10)} </td>
                    <td> {i.discount}% </td>
                    <td>₹{i.minOrder} </td>
                    <td>
                      <span style={{ display: "flex", gap: "5px" }}>
                        <AiFillDelete
                          color="red"
                          cursor="pointer"
                          onClick={() => deleteCoupon(i._id)}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </Table>
        </div>
      </section>
    </>
  );
};

export default HOC(Coupon);
