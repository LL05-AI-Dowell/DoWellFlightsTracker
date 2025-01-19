/* eslint-disable react/no-unescaped-entities */
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-4xl px-4 py-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 mx-auto bg-blue-500 rounded-xl flex items-center justify-center"
          >
            <span className="text-3xl">📊</span>
          </motion.div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Reports Coming Soon
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We're building a powerful reporting system for DoWell Flight Tracker. Soon you'll be able to generate comprehensive flight analytics and insights.
          </p>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gray-800 rounded-xl"
            >
              <div className="text-blue-400 text-2xl mb-3">📈</div>
              <h3 className="text-lg font-semibold mb-2">
                Custom Analytics
              </h3>
              <p className="text-gray-400">
                Generate detailed reports with custom date ranges and metrics that matter to you
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gray-800 rounded-xl"
            >
              <div className="text-blue-400 text-2xl mb-3">📱</div>
              <h3 className="text-lg font-semibold mb-2">
                Export Options
              </h3>
              <p className="text-gray-400">
                Download reports in multiple formats for easy sharing and analysis
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="inline-flex items-center space-x-2 text-gray-400">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
              <span>Feature in development</span>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-base font-semibold shadow-lg"
            onClick={() => window.history.back()}
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;