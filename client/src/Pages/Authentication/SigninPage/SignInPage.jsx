// Frontend: SignInPage.jsx
import { useState, useEffect } from "react";
import { Shield, ShieldAlert, RefreshCw } from "lucide-react";
import { SignIn } from "../../../services/api.config.js";

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState({
    status: null,
    lastChecked: null,
  });
  const [formData, setFormData] = useState({
    workspace_name: "",
    portfolio: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showOverlay, setShowOverlay] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    checkServerHealth();
    const interval = setInterval(checkServerHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkServerHealth = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/v1/auth/?type=signin", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      });

      const data = await response.json();

      setHealthStatus({
        status: data.status === "healthy" ? "healthy" : "unhealthy",
        lastChecked: new Date(),
        message: data.message,
      });
    } catch (error) {
      console.error("Health check failed:", error);
      setHealthStatus({
        status: "unhealthy",
        lastChecked: new Date(),
        // message: "Service unavailable",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.workspace_name.trim()) {
      newErrors.workspace_name = "Product ID is required";
    }

    if (!formData.portfolio.trim()) {
      newErrors.portfolio = "User ID is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {}
    );
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await SignIn({
        workspace_name: formData.workspace_name,
        portfolio: formData.portfolio,
        password: formData.password,
      });

      if (response?.token) {
        localStorage.setItem("token", response.token);
        window.location.href = "/dashboard";
      } else {
        setApiError("Invalid response from server");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setApiError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleOverlay = () => {
    setShowOverlay((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative">
      <div className="absolute right-4 top-4">
        <div className="group relative">
          <button
            onClick={checkServerHealth}
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl ${
              healthStatus.status === "healthy"
                ? "bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600"
                : "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600"
            }`}
          >
            <div className="relative">
              {healthStatus.status === "healthy" ? (
                <Shield className="w-5 h-5 text-white" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-white" />
              )}
              <RefreshCw
                className={`absolute top-0 left-0 w-5 h-5 text-white opacity-0 transition-all duration-300 ${
                  isChecking ? "animate-spin opacity-100" : ""
                }`}
              />
            </div>
            <span className="text-white font-medium">
              {healthStatus.status === "healthy"
                ? "System Healthy"
                : "System Error"}
            </span>
          </button>
          {healthStatus.message && (
            <div className="absolute top-full mt-2 right-0 bg-white p-2 rounded shadow-lg text-sm">
              {healthStatus.message}
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center relative">
        <div className="mb-6">
          <img
            src="https://dowellfileuploader.uxlivinglab.online/hr/logo-2-min-min.png"
            alt="Logo"
            className="w-60 h-60 object-contain"
          />
        </div>

        {apiError && (
          <div className="w-full mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-800 text-sm">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1">
            <input
              type="text"
              name="workspace_name"
              placeholder="Enter Product ID"
              value={formData.workspace_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.workspace_name && touched.workspace_name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
            />
            {errors.workspace_name && touched.workspace_name && (
              <p className="text-red-500 text-sm">{errors.workspace_name}</p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="text"
              name="portfolio"
              placeholder="Enter User ID"
              value={formData.portfolio}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.portfolio && touched.portfolio
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
            />
            {errors.portfolio && touched.portfolio && (
              <p className="text-red-500 text-sm">{errors.portfolio}</p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password && touched.password
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
            />
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={toggleOverlay}
              className="w-1/2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 px-3 py-2 rounded transition-colors ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                Register
              </a>
            </p>
          </div>

          <button
            type="button"
            onClick={toggleOverlay}
            className="w-32 mx-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors text-center block"
          >
            Help
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
