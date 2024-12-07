import React, { useState } from "react";
import * as Yup from "yup";

const FormWithYup = () => {
  const [data, setData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [err, setErr] = useState({});

  const signUpObject = Yup.object({
    fullname: Yup.string().required("Full name is required"),
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
      localStorage.setItem("user", JSON.stringify(data));
      alert("Signup succesfull..");
      setErr({});
    } catch (error) {
      // console.log(error.inner)
      const allErrors = {};
      error.inner.forEach((err) => {
        allErrors[err.path] = err.message;
      });
      setErr(allErrors);
    }
  }; // needs to be changed ***

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
        <div className="bg-[#2A2739] space-y-5 w-fit p-10">
          <div>
            <label>Full name:</label>
            <input
              type="text"
              name="fullname"
              value={data.fullname}
              placeholder="Enter Full name"
              onChange={handleClick}
            />
            {err.fullname && <div className="err">*{err.fullname}</div>}
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={data.email}
              placeholder="Enter Email"
              onChange={handleClick}
            />
            {err.email && <div className="err">*{err.email}</div>}
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Enter Password"
              onChange={handleClick}
            />
            {err.password && <div className="err">*{err.password}</div>}
          </div>

          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default FormWithYup;
