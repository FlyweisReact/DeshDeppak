/** @format */

import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import HOC from "../../layout/HOC";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Spin from "../../../Component/Spinner";

const Fedd = () => {
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [parentC, setPC] = useState([]);

  //Add product
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [Stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCat] = useState("");
  const [coloursAvailable, setColor] = useState([]);
  const [sizesAvailable, setSize] = useState([]);
  //-------------------------------------

  //Vendor Authorization
  const Vendor = localStorage.getItem("VendorToken");

  //Fetch products

  const fetchproducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://desh-deepak-backend.herokuapp.com/api/v1/vender/products/",
        {
          headers: {
            Authorization: `Bearer ${Vendor}`,
          },
        }
      );
      setData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Network issue please retry after some time ");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchproducts();
    fetchParentCategory();
  }, [axios, Vendor, toast]);

  //--------------------------------------------------------------------------------

  // Parent Categories

  const fetchParentCategory = async () => {
    try {
      const { data } = await axios.get(
        "https://desh-deepak-backend.herokuapp.com/api/v1/getAllCategory"
      );
      setPC(data);
    } catch (err) {
      console.log(err);
    }
  };

  //---------------------------------------------------------------------

  // Add Product

  const addProduct = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("Stock", Stock);
    Array.from(images).forEach((img) => {
      fd.append("images", img);
    });
    fd.append("price", price);
    fd.append("category", category);
    fd.append("coloursAvailable", coloursAvailable);
    fd.append("sizesAvailable", sizesAvailable);

    let auth = { headers: { Authorization: `Bearer ${Vendor}` } };

    try {
      const { data } = await axios.post(
        "https://desh-deepak-backend.herokuapp.com/api/v1/vender/product/new",
        fd,
        auth
      );
      console.log(data);
      toast.success("Product added successfully");
      fetchproducts();
      setPopup(false);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };

  //--------------------------------------------------------

  //delete Product

  const deleteProduct = async (id) => {
    try {
      const data = await axios.delete(
        `https://desh-deepak-backend.herokuapp.com/api/v1/vender/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${Vendor}`,
          },
        }
      );
      toast.success("Product Deleted SuccessFully");
      fetchproducts();
    } catch (err) {
      console.log(err);
      toast.error("Please try again after aome tome");
    }
  };

  //------------------------------------------------------------------------------

  return (
    <>
      <section>
        <div className="pb-4 sticky top-0  w-full flex justify-between items-center bg-white">
          <span className="tracking-widest text-slate-900 font-semibold uppercase ">
            All Products
          </span>
          <button
            onClick={() => {
              setPopup(!popup);
            }}
            className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[rgb(241,146,46)] text-white tracking-wider"
          >
            Add Product
          </button>
        </div>
        {/* Add Form */}
        <section
          className={
            popup
              ? "fixed top-0 left-0 wcomp bg-[rgb(0,0,0,0.5)] transition-all duration-150 w-full flex justify-center items-center overflow-y-auto  h-screen "
              : "hidden"
          }
          style={{ maxHeight: "100%", overflow: "auto" }}
        >
          <div className="bg-slate-100 overflow-y-auto  lg:w-3/6  md:w-4/6 w-5/6 mx-auto  rounded-lg">
            <div className="flex sticky top-0 py-3 px-5 bg-slate-100 justify-between">
              <span className=" font-semibold text-[rgb(241,146,46)] ">
                Add Product
              </span>
              <div className="text-[rgb(241,146,46)] py-0.5 text-2xl cursor-pointer font-medium tracking-wider">
                <IoMdClose
                  onClick={() => {
                    setPopup(false);
                  }}
                />{" "}
              </div>
            </div>
            <form
              className="grid  grid-cols-1 gap-x-7 gap-y-4 p-4"
              onSubmit={addProduct}
              style={{ color: "black" }}
            >
              <div className="inline-flex  w-full flex-col">
                <label className="text-gray-800 mb-1.5 tracking-wider font-semibold text-sm">
                  Product Image
                </label>
                <input
                  type="file"
                  onChange={(e) => setImages(e.target.files)}
                  multiple
                />
              </div>

              <div className="inline-flex  w-full flex-col">
                <label className="text-gray-800 mb-1.5 tracking-wider font-semibold text-sm">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="shoes"
                  className="formInput"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="inline-flex  w-full flex-col">
                <label className="text-gray-800 mb-1.5 tracking-wider font-semibold text-sm">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  min={"1"}
                  className="formInput"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="inline-flex  w-full flex-col">
                <label className="text-gray-800 mb-1.5 tracking-wider font-semibold text-sm">
                  Category
                </label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => setCat(e.target.value)}
                >
                  <option>Select Parent Category</option>
                  {parentC?.categories?.map((i, index) => (
                    <option key={index} value={i._id}>
                      {i.parentCategory}{" "}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="inline-flex  w-full flex-col">
                <label className="text-gray-800 mb-1.5 tracking-wider font-semibold text-sm">
                  Stock
                </label>
                <input
                  type="number"
                  min={10}
                  className="formInput"
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="inline-flex  w-full flex-col">
                <label className="text-gray-800 mb-1.5 tracking-wider font-semibold text-sm">
                  Colors Available
                </label>

                <input
                  type="text"
                  className="formInput"
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="inline-flex  w-full flex-col">
                <label className="text-gray-800 mb-1.5 tracking-wider font-semibold text-sm">
                  Size Availbale
                </label>
                <input
                  type="text"
                  className="formInput"
                  onChange={(e) => setSize(e.target.value)}
                />{" "}
              </div>
              <div className="inline-flex  w-full flex-col">
                <label className="text-gray-800 mb-1.5 tracking-wider font-semibold text-sm">
                  Description
                </label>
                <textarea
                  style={{ color: "black", padding: "5px" }}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              {/*  price */}

              <button
                type="submit"
                className="bg-[rgb(241,146,46)] flex items-center justify-center cursor-pointer w-40 hover:bg-[rgb(241,146,46)] py-1 rounded-full"
              >
                Add Products
              </button>
            </form>
          </div>
        </section>

        <div style={{ maxWidth: "100%", overflow: "auto" }}>
          <Table style={{ paddingTop: "5%", textAlign: "center" }}>
            <thead>
              <tr className=" border-b bg-green-300 shadow-xl text-gray-900">
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Ratings</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Number of Reviews</th>
                <th>Color Available</th>
                <th>Size Available</th>
                <th>Actions</th>
              </tr>
            </thead>

            {loading ? (
              <Spin />
            ) : (
              <tbody>
                {data?.data?.map((i, index) => (
                  <tr key={index} style={{ marginTop: "1%" }}>
                    <td>
                      {i.images.length === 0 ? (
                        <img
                          src={
                            "https://www.legrand.co.in/ecatalogue/images/products/default.jpg"
                          }
                          className="img-fluid img-thumbnail"
                          alt="No Image Rendering"
                        />
                      ) : (
                        i.images?.map((i, index) => (
                          <img
                            src={i.url}
                            key={index}
                            alt={"Product Image"}
                            className="img-fluid img-thumbnail "
                          />
                        ))
                      )}
                    </td>
                    <td>{i.name}</td>
                    <td>{i.price}</td>
                    <td>{i.ratings}</td>
                    <td>{i.category?.parentCategory}</td>
                    <td>{i.Stock}</td>
                    <td>{i.numOfReviews}</td>
                    <td>
                      {" "}
                      {i.coloursAvailable?.map((e) => (
                        <span> {e} </span>
                      ))}
                    </td>
                    <td>
                      {" "}
                      {i.sizesAvailable?.map((e) => (
                        <span> {e} </span>
                      ))}
                    </td>
                    <td>
                      <span style={{ display: "flex", gap: "5px" }}>
                        <AiFillEdit
                          color="blue"
                          cursor="pointer"
                          onClick={() => {
                            setPopup(!popup);
                          }}
                        />
                        <AiFillEye
                          cursor="pointer"
                          onClick={() => navigate(`/viewProduct/${i._id}`)}
                        />
                        <AiFillDelete
                          color="red"
                          cursor="pointer"
                          onClick={() => deleteProduct(i._id)}
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

export default HOC(Fedd);

//viewProduct
