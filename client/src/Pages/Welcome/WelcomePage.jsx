import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getServerHealth } from "../../services/api.config";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg"

const WelcomePage = () => {
  const [healthStatus, setHealthStatus] = useState({
    isHealthy: false,
    message: "Checking system status...",
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const response = await getServerHealth();
      setHealthStatus({
        isHealthy: response.success,
        message: response.message,
      });
    } catch (error) {
      console.log(error);
      setHealthStatus({
        isHealthy: false,
        message: "System status check failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-4xl px-4 py-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 mx-auto flex items-center justify-center"
          >
            <img src={logo} alt="logo" />
          </motion.div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            DoWell Flight Tracker
          </h1>

          <p className="text-lg text-gray-300">
            Discover nearby airports and track real-time flights based on your
            location. Get instant access to arrivals and departures with our
            powerful tracking system.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-4 bg-gray-800 rounded-xl"
            >
              <div className="text-blue-400 text-2xl mb-2">🎯</div>
              <h3 className="text-lg font-semibold mb-1">
                Location-Based Search
              </h3>
              <p className="text-gray-400 text-sm">
                Find airports within your specified radius using precise
                coordinates
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-4 bg-gray-800 rounded-xl"
            >
              <div className="text-blue-400 text-2xl mb-2">🕒</div>
              <h3 className="text-lg font-semibold mb-1">Real-Time Updates</h3>
              <p className="text-gray-400 text-sm">
                Track arrivals and departures with up-to-the-minute accuracy
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-4 bg-gray-800 rounded-xl"
            >
              <div className="text-blue-400 text-2xl mb-2">📊</div>
              <h3 className="text-lg font-semibold mb-1">Detailed Analytics</h3>
              <p className="text-gray-400 text-sm">
                Access comprehensive flight data organized by date and time
              </p>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-base font-semibold shadow-lg"
            onClick={()=>navigate('/signin')}
          >
            Get Started →
          </motion.button>

          <motion.div
            className="mt-4 flex items-center justify-center space-x-2 text-sm"
            animate={{
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isLoading
                  ? "bg-yellow-500"
                  : healthStatus.isHealthy
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
            <span
              className={`${
                isLoading
                  ? "text-yellow-400"
                  : healthStatus.isHealthy
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {healthStatus.message}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;