/** @format */

import React, { useState } from "react";
import HOC from "../../layout/HOC";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Image from "../../../../../Component/Banner.jpg";

const BannerImage = [
  {
    image:
      "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2022%2F10%2Froad-of-naruto-anniversary-trailer-20th-anniversary-info-000.jpg?fit=max&cbr=1&q=90&w=750&h=500",
    name: "Image Of Banner",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXhiKcrSLX9a-yF9rS4qR5Iz8rdD0GuwA9jqC_ySyPs-XR7335v62e6ApzZodYwSvDiKQ&usqp=CAU",
    name: "Image Of Banner",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2eFrIZnVZaIoDkjVh8lbcZtQHVI20dpZ7VA&usqp=CAU",
    name: "Image Of Banner",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-A0sC9efi8q1WcBOSxiL54JeverkoprDEEw&usqp=CAU",
    name: "Image Of Banner",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShlG4Urst44E0RNXFWEHFZsLucIj1DzOE7CA&usqp=CAU",
    name: "Image Of Banner",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScy9iUuq9tuI8od0d9Ekpzmcpdy3U2uS8JZjHfGy9L7w_SRqB4iwhQI3FhMeLU1r_3h_c&usqp=CAU",
    name: "Image Of Banner",
  },
];

const Ban = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [id, setID] = useState("");

  //Add Banner Image / Edit Banner

  function MyVerticallyCenteredModal(props) {
    const [url, setUrl] = useState("");
    const [image, setI] = useState("");
    const [name, setN] = useState("");

    //Cloudinary

    const postDetails = (e) => {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "ml_default");
      data.append("cloud_name", "dbcnha741");
      fetch("https://api.cloudinary.com/v1_1/dbcnha741/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.url);
          console.log(data);
          console.log(data?.url);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    //------------------------------------------------------------

    //Add Banner

    const addBanner = (e) => {
      e.preventDefault();
      try {
        setTimeout(async () => {
          const data = await axios.post(
            "https://desh-deepak-backend.herokuapp.com/api/v1/banner",
            { name, link: url }
          );
          toast.success("Banner Added SuccessFully");
          setModalShow(false);
          Banner();
        }, 2000);
      } catch (err) {
        console.log(err);
        toast.error("Please try again after some time");
      }
    };

    //Edit Banner
    const editBanner = async (e) => {
      e.preventDefault();
      try {
        const data = await axios.patch(
          `https://desh-deepak-backend.herokuapp.com/api/v1/banner/${id}`,
          { name }
        );
        toast.success("Banner edited successfully");
        setModalShow(false);
        Banner();
      } catch (err) {
        console.log(err);
        toast.error("Please try again afetr some time");
      }
    };

    //------------------------------------------------------------------

    return (
      <Modal
        {...props}
        size="lg-down"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {edit ? "Edit Banner" : "Add Banner"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            style={{
              color: "black",
              margin: "auto",
            }}
            onSubmit={edit ? editBanner : addBanner}
            // onSubmit={addBanner}
            // onSubmit={edit ? editBan : submitHandler}
          >
            {edit ? (
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="New"
                  required
                  onChange={(e) => setN(e.target.value)}
                />
              </Form.Group>
            ) : (
              <>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setI(e.target.files[0])}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="New"
                    required
                    onChange={(e) => setN(e.target.value)}
                    onClick={(e) => postDetails()}
                  />
                </Form.Group>
              </>
            )}

            <Button variant="outline-success" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  //-----------------------------------------------------------

  //Get All Banner

  const Banner = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://desh-deepak-backend.herokuapp.com/api/v1/banner"
      );
      setData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Network Error");
    }
  };

  useEffect(() => {
    Banner();
  }, [axios, setData, setLoading, toast]);

  //---------------------------------------------------------------------------------------------

  const deleteData = async (id) => {
    try {
      const data = await axios.delete(
        `https://desh-deepak-backend.herokuapp.com/api/v1/banner/${id}`
      );
      toast.success("Banner deleted Successfully");
      Banner();
    } catch (err) {
      console.log(err);
      toast.error("Please try again after some time");
    }
  };

  // Edit Banner name

  //--------------------------------------------------------

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <section>
        <div className="pb-4 sticky top-0  w-full flex justify-between items-center bg-white">
          <span className="tracking-widest text-slate-900 font-semibold uppercase ">
            All Banner
          </span>
          <Button
            variant="outline-success"
            onClick={() => {
              setEdit(false);
              setModalShow(true);
            }}
          >
            Add-Banner
          </Button>
        </div>
      </section>

      <section
        className="main-card--container"
        style={{ color: "black", marginBottom: "10%" }}
      >
        {data?.data?.map((i) => {
          return (
            <>
              <div className="card-container">
                <div className="card">
                  <div className="card-body">
                    <img
                      src={i.link ? i.link : Image}
                      style={{ width: "100%", height: "200px" }}
                      alt={i.name}
                    />
                    <div className="card-title">{i.name}</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        variant="outline-info"
                        onClick={() => {
                          setID(i._id);
                          setEdit(true);
                          setModalShow(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => deleteData(i._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </section>
    </>
  );
};

export default HOC(Ban);
