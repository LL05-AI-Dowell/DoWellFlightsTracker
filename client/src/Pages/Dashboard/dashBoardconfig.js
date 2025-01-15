import { 
    FaHome, 
    FaChartBar, 
    FaCog, 
    FaUser 
  } from "react-icons/fa";
  
  export const dashboardConfig = {
    logo: {
      src: "https://dowellfileuploader.uxlivinglab.online/hr/logo-2-min-min.png",
      alt: "Logo",
      title: "MyApp",
    },
    generalItems: [
      { label: "Dashboard", icon: FaHome, path: "/dashboard", sublabels: [] },
      { label: "Report", icon: FaChartBar, path: "/dashboard/product", sublabels: [] },
      { label: "Setting", icon: FaCog, path: "/dashboard/contactus", sublabels: [] },
      { label: "User Profile", icon: FaUser, path: "/dashboard/userprofile", sublabels: [] }
    ],
    settingItems: []
  };
  