import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import SignInPage from "./Pages/Authentication/SigninPage/SignInPage";
import SignupPage from "./Pages/Authentication/SignupPage/SignUpPage";
import HomePage from "./Pages/Home/HomePage";
import WelcomePage from "./Pages/Welcome/WelcomePage";

import UserProfilePage from "./Pages/UserProfile/UserProfilePage";
import ReportPage from './Pages/Report/ReportPage';
import FlightTrackerPageMobileView from "./Pages/MobileView/FlightTrackerPageMobileView";
import FlightTrackerPage from "./Pages/FlightTrackerPrage/FlightTrackerPage";

const App = () => {
  return (
    <>
      <Toaster reverseOrder={false} />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dowellflighttracker" element={<FlightTrackerPage />} />
        <Route path="/dowellflighttrackermobileview" element={<FlightTrackerPageMobileView />} />

        <Route path="dashboard" element={<DashboardPage />}>
          <Route index element={<HomePage />} />
          <Route path="userprofile" element={<UserProfilePage />} />
          <Route path="report" element={<ReportPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
