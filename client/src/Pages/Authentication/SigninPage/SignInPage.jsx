import { Shield, ShieldAlert, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { getServerHealth, SignIn } from "../../../services/api.config";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [healthStatus, setHealthStatus] = useState({
    isHealthy: false,
    message: "Checking system status...",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    workspaceName: "",
    userId: "",
    password: "",
  });

  const navigate = useNavigate()

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const fetchServerHealth = async () => {
      try {
        const response = await getServerHealth();
        if (response.success) {
          setHealthStatus({ isHealthy: true, message: "System is healthy." });
        } else {
          setHealthStatus({ isHealthy: false, message: "System is unhealthy." });
        }
      } catch (error) {
        console.error("Error fetching server health:", error);
        setHealthStatus({ isHealthy: false, message: "Failed to check system status." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServerHealth();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoggingIn(true); 

    try {
      
      const response = await SignIn(formData);

      if (response.success) {
        if (response.response.is_active){
          // store access token
          localStorage.setItem('accessToken', response.access_token);
          // store refresh token
          localStorage.setItem('refreshToken', response.refresh_token);
          toast.success("Login successful")
          // Redirect to dashboard page
          navigate('/dashboard');
        } else{
          toast.error("Account is inactive, please contact administrator")
        }
        
      } else {
        toast.error("Failed to Login successful")
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative">
      <div className="absolute right-4 top-4">
        <div className="group relative">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl ${
              healthStatus.isHealthy
                ? "bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600"
                : "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600"
            }`}
          >
            <div className="relative">
              {isLoading ? (
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
              ) : healthStatus.isHealthy ? (
                <Shield className="w-5 h-5 text-white" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-white" />
              )}
            </div>
            <span className="text-white font-medium">
              {isLoading
                ? "Checking..."
                : healthStatus.isHealthy
                ? "System Healthy"
                : "System Error"}
            </span>
          </button>
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

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1">
            <input
              onChange={handleChange}
              type="text"
              name="workspaceName"
              value={formData.workspaceName}
              placeholder="Enter Product ID"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-1">
            <input
              onChange={handleChange}
              type="text"
              name="userId"
              value={formData.userId}
              placeholder="Enter User ID"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-1">
            <input
              onChange={handleChange}
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              className="w-1/2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-1/2 px-3 py-2 rounded transition-colors ${
                isLoggingIn ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isLoggingIn ? "Logging In..." : "Login"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm">
              Dont have an account?{" "}
              <a href="/dowelltracker/signup" className="text-blue-600 hover:underline">
                Register
              </a>
            </p>
          </div>

          <button
            type="button"
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
