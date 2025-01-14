import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import SignInPage from "./Pages/Authentication/SigninPage/SignInPage";
import SignupPage from "./Pages/Authentication/SignupPage/SignUpPage";
import HomePage from "./Pages/Home/HomePage";
import WelcomePage from "./Pages/Welcome/WelcomePage";

const App = () => {
  return (
    <>
      <Toaster reverseOrder={false} />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="dashboard" element={<DashboardPage />}>
          <Route index element={<HomePage />} />
        </Route>

      </Routes>
    </>
  );
};

export default App;
