/** @format */

import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import HOC from "../../layout/HOC";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Spin from "../../../Component/Spinner";

const Sub = () => {
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subCat, setData] = useState([]);
  const [parentCategory, setP] = useState("");
  const [subcat, setS] = useState("");
  const [parentC, setParentC] = useState([]);

  //  Admin Authorization
  const token = localStorage.getItem("VendorToken");
  const Auth = { headers: { Authorization: `Bearer ${token} ` } };

  // Add Sub-Category
  const addSub = async (e) => {
    e.preventDefault();

    const form = { parentCategory, subCategory: subcat };

    try {
      const data = await axios.post(
        "https://desh-deepak-backend.herokuapp.com/api/v1/vender/subCategory",
        form,
        Auth
      );
      toast.success("Sub-Category added successfully");
      setPopup(false);
      subCategory();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };

  //-------------------------------------------------

  // All Sub-Categories

  const subCategory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://desh-deepak-backend.herokuapp.com/api/v1/vender/subCategory",
        Auth
      );
      setData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Check Your Network");
      setLoading(false);
    }
  };

  useEffect(() => {
    subCategory();
    fetchParentCategory();
  }, [axios, setData, toast]);

  //----------------------------------------------------------

  // Prent Category

  const fetchParentCategory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://desh-deepak-backend.herokuapp.com/api/v1/vender/categories" , Auth
      );
      setParentC(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Network Error");
      setLoading(false);
    }
  };

  //---------------------------------------------------------

  // Delete Sub-Category

  const deleteSubCat = async (id) => {
    try{
      const data = await axios.delete(``)
     }catch(err){
      console.log(err)
    }
  }
 
  return (
    <>
      <section>
        <div className="pb-4 sticky top-0  w-full flex justify-between items-center bg-white">
          <span className="tracking-widest text-slate-900 font-semibold uppercase ">
            All Sub-Categories
          </span>
          <button
            onClick={() => {
              setPopup(!popup);
            }}
            className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[rgb(241,146,46)] text-white tracking-wider"
          >
            Add Sub-Category
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
                Add Sub-Category
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
              onSubmit={addSub}
              style={{ color: "black" }}
            >
              <div className="inline-flex  w-full flex-col">
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => setP(e.target.value)}
                >
                  <option>Select Parent Category</option>

                  {parentC?.categories?.map((i) => (
                    <option value={i._id}> {i.parentCategory} </option>
                  ))}
                </Form.Select>
              </div>

              <div className="inline-flex  w-full flex-col">
                <input
                  type="text"
                  placeholder="Sub-Category"
                  style={{
                    outline: "none",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                  onChange={(e) => setS(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-[rgb(241,146,46)] flex items-center justify-center cursor-pointer w-40 hover:bg-[rgb(241,146,46)] py-1 rounded-full"
              >
                Add
              </button>
            </form>
          </div>
        </section>

        <div style={{ maxWidth: "100%", overflow: "auto" }}>
          <Table style={{ paddingTop: "5%" }}>
            <thead>
              <tr className=" border-b bg-green-300 shadow-xl text-gray-900">
                <th> Sub-Category</th>
                <th>Parent-Category </th>
                <th>Actions</th>
              </tr>
            </thead>

            {loading ? (
              <Spin />
            ) : (
              <tbody>
                {subCat?.data?.[0]?.map((i, index) => (
                  <tr key={index} style={{ marginTop: "1%" }}>
                    <td> {i.subCategory} </td>
                    <td>{i.parentCategory}</td>
                    <td>
                      <span style={{ display: "flex", gap: "5px" }}>
                        <AiFillDelete color="red" cursor="pointer" />
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

export default HOC(Sub);
