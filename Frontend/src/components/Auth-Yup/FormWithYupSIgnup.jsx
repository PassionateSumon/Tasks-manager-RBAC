import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { createUser } from "../../redux/slices/userSlice";
import { registerAdmin } from "../../redux/slices/adminSlice";
import { createModerator } from "../../redux/slices/moderatorSlice";
import { useNavigate } from "react-router-dom";

const FormWithYupSignup = ({ role }) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [err, setErr] = useState({});

  const signUpObject = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password should be atleast 8 characters")
      .matches(
        /[!@#$%^&*()<>|{}.?:;"~]/,
        "Password should have atleast one special character"
      )
      .matches(/[a-z]/, "Password should have atleast one lowercase character")
      .matches(/[A-Z]/, "Password should have atleast one uppercase character")
      .matches(/[0-9]/, "Password should have atleast one digit")
      .required("Password is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUpObject.validate(data, { abortEarly: false });
      if (role === "User") {
        dispatch(createUser(data)).then((res) => {
          const stat = res.type.split("/")[2];
          if (stat === "fulfilled") {
            setData({
              name: "",
              email: "",
              password: "",
            });
          }
        });
      } else if (role === "Admin") {
        dispatch(registerAdmin(data)).then((res) => {
          const stat = res.type.split("/")[2];
          if (stat === "fulfilled") {
            setData({
              name: "",
              email: "",
              password: "",
            });
          }
        });
      } else {
        dispatch(createModerator(data)).then((res) => {
          const stat = res.type.split("/")[2];
          if (stat === "fulfilled") {
            setData({
              name: "",
              email: "",
              password: "",
            });
          }
        });
      }
      setErr({});
      navigate("/login");
    } catch (error) {
      console.log("error: ", error);
      console.log(error?.inner);
      const allErrors = {};
      error?.inner?.forEach((err) => {
        allErrors[err?.path] = err?.message;
      });
      setErr(allErrors);
    }
  }; // needs to be changed ***  --> almost done

  const handleClick = (e) => {
    let { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    setData((prevInterest) => {
      if (checked) {
        return { ...prevInterest, interest: [...prevInterest.interest, name] };
      } else {
        return {
          ...prevInterest,
          interest: prevInterest.interest.filter((inter) => inter !== name),
        };
      }
    });
  };

  return (
    <div className="">
      <form className="form" onSubmit={handleSubmit}>
        <div className="bg-[#2A2739] rounded-2xl space-y-10 w-fit px-6 py-10 text-[#E6E1FF] shadow-[0_4px_15px_rgba(245,66,152,0.6)] ">
          <label className="flex justify-center text-3xl font-bold mt-[-20px] ">
            Signup
          </label>
          <div className="flex items-center space-x-10">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={data.name}
              placeholder="Enter Name"
              onChange={handleClick}
              className="rounded-md p-2 bg-transparent border border-[#7d0a68] "
            />
            {err.name && <div className="err">*{err.name}</div>}
          </div>

          <div className="flex items-center space-x-11">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={data.email}
              placeholder="Enter Email"
              onChange={handleClick}
              className="rounded-md p-2 bg-transparent border border-[#7d0a68]"
            />
            {err.email && <div className="err">*{err.email}</div>}
          </div>

          <div className="flex items-center space-x-4">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Enter Password"
              onChange={handleClick}
              className="rounded-md p-2 bg-transparent border border-[#7d0a68]"
            />
            {err.password && <div className="err">*{err.password}</div>}
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className=" border py-2 px-4 rounded-md hover:border-2 hover:border-[#7d0a68] duration-200 hover:scale-105 "
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormWithYupSignup;
