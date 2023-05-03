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
import Spin from "../../../../../Component/Spinner";

const Order = () => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [id, setID] = useState("");

  //Admin Token

  const token = localStorage.getItem("token");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch Orders
  const Orders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://desh-deepak-backend.herokuapp.com/api/v1/order",
        Auth
      );
      console.log(data);
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

  //Update delivery Status
  function MyVerticallyCenteredModal(props) {
    const [status, setStatus] = useState("");

    const updateStatus = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.put(
          `https://desh-deepak-backend.herokuapp.com/api/v1/order/admin/${id}`,
          { status },
          Auth
        );
        toast.success("Delivery Status changed successfully");
        setModalShow(false);
        Orders();
      } catch (err) {
        console.log(err);
        toast.err(err?.response?.message?.data);
      }
    };

    //----------------------------------

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Delivery Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateStatus}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Delivered</Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>delivery Status</option>
                <option value="Delivered">Yes</option>
                <option>No</option>
              </Form.Select>
            </Form.Group>
            <br />

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  //-----------------------

  //Delete Order

  const deleteOrder = async (id) => {
    try {
      const data = await axios.delete(
        `https://desh-deepak-backend.herokuapp.com/api/v1/order/admin/${id}`,
        Auth
      );
      toast.success("Order Deleted SuccessFully");
      Orders();
    } catch (err) {
      console.log(err);
      toast.error("Network Issue");
    }
  };

  //--------------------------------------------

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
          <Table style={{ paddingTop: "5%" }}>
            <thead>
              <tr className=" border-b bg-green-300 shadow-xl text-gray-900">
                <th>Product Image</th>
                <th>Product Name</th>
                <th>User Name</th>
                <th>Discount</th>
                <th>Quantity</th>
                <th>Shipping Price</th>
                <th>Grand Total</th>
                <th>Payment Status</th>
                <th>Order status</th>
                <th>Delivered</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading ? (
              <Spin />
            ) : (
              <tbody>
                {data?.orders?.map((i, index) => (
                  <tr key={index} style={{ marginTop: "1%" }}>
                    <td style={{ display: "block" }}>
                      <ul>
                        {i.products?.map((e) =>
                          e.product?.images?.map((img, index) => (
                            <li style={{ listStyleType: "disc" }}>
                              <img
                                src={img.url}
                                key={index}
                                className="img-fluid img-thumbnail"
                              />
                            </li>
                          ))
                        )}
                      </ul>
                    </td>
                    <td>
                      <ul>
                        {i?.products?.map((e, index) => (
                          <li key={index} style={{ listStyleType: "decimal" }}>
                            {e.product?.name}{" "}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{i.user?.name}</td>
                    <td>{i.discount}%</td>
                    <td>
                      {i.products?.map((q, index) => (
                        <p key={index}> {q.quantity} </p>
                      ))}
                    </td>
                    <td>₹{i.shippingPrice}</td>
                    <td>₹{i.grandTotal}</td>
                    <td>{i.paymentStatus}</td>
                    <td>{i.orderStatus}</td>
                    <td>{i.delivered === true ? "Yes" : "No"}</td>
                    <td>
                      <span style={{ display: "flex", gap: "5px" }}>
                        <AiFillEdit
                          color="blue"
                          cursor="pointer"
                          onClick={() => {
                            setModalShow(true);
                            setID(i._id);
                          }}
                        />
                        <AiFillDelete
                          color="red"
                          cursor="pointer"
                          onClick={() => {
                            deleteOrder(i._id);
                          }}
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

export default HOC(Order);
