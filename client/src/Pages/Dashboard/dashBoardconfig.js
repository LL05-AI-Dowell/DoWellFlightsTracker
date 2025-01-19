import { 
    FaHome,
    FaUser 
  } from "react-icons/fa";
  import logo from '../../assets/logo.svg'
  
  export const dashboardConfig = {
    logo: {
      src: logo,
      alt: "Logo",
      title: "MyApp",
    },
    generalItems: [
      { label: "Dashboard", icon: FaHome, path: "/dashboard", sublabels: [] },
      // { label: "Report", icon: FaChartBar, path: "/dashboard/report", sublabels: [] },
      { label: "User Profile", icon: FaUser, path: "/dashboard/userprofile", sublabels: [] }
    ],
    settingItems: []
  };
  