import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    code: "",
    email: "",
    confirmEmail: "",
  });

  const [errors, setErrors] = useState({
    code: "",
    email: "",
    confirmEmail: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      code: "",
      email: "",
      confirmEmail: "",
    };

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.confirmEmail.trim()) {
      newErrors.confirmEmail = "Please confirm your email";
      isValid = false;
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = "Emails do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted:", formData);
      toast.success("Registration successful! Please check your email.");
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  return (
    <div className="bg-white w-full h-screen flex items-center justify-center">
      <div className="w-[500px] p-6">
        <div className="flex items-center justify-center">
          <img
            className="h-[200px] w-[200px] object-contain"
            src="https://dowellfileuploader.uxlivinglab.online/hr/logo-2-min-min.png"
            alt=""
          />
        </div>
       

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="code"
              placeholder="Enter the code shown below your QR code in the sticker"
              value={formData.code}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.code ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="confirmEmail"
              placeholder="Confirm your email"
              value={formData.confirmEmail}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.confirmEmail ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.confirmEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmEmail}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit then check your mail for credentials
          </button>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/signin"
              className="w-full flex items-center justify-center py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <Link
              to="/help"
              className="w-full flex items-center justify-center py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Help
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
