/* eslint-disable react/no-unescaped-entities */
const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-6">
          <img
            src="https://dowellfileuploader.uxlivinglab.online/hr/logo-2-min-min.png"
            alt="Logo"
            className="w-60 h-60 object-contain"
          />
        </div>
        <form className="w-full space-y-3">
          <input
            type="text"
            placeholder="Enter Product ID"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter User ID"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Enter password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-3">
            <button
              type="button"
              className="w-1/2 px-3 py-2 bg-gray-200 text-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-3 py-2 bg-blue-600 text-white rounded"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-3 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <a href="#" className="text-blue-600">
              Register
            </a>
          </p>
        </div>
        <button className="mt-3 px-6 py-2 bg-green-400 text-white rounded-md">
          Help
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
