import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { isTokenExpired } from '../../utils/utils';
import { dashboardConfig } from './dashBoardconfig';

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || isTokenExpired(token)) {
      navigate('/signin');
    }
  }, [navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleSubmenu = (index) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 w-64 bg-[#0c1014] text-white flex flex-col h-screen fixed z-50 md:static md:translate-x-0`}
      >
        <div className="p-2 flex items-center justify-center">
          <img
            src={dashboardConfig.logo.src}
            alt={dashboardConfig.logo.alt}
            className="h-12"
          />
          <button onClick={toggleMobileMenu} className="md:hidden">
            ✖️
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4">
            <div className="mb-6">
              {dashboardConfig.generalItems.map((item, index) => (
                <div key={index}>
                  <div
                    className="flex items-center text-sm py-3 px-4 cursor-pointer hover:bg-green-600 hover:rounded-xl transition-all"
                    onClick={() => navigate(`${item.path}`)} 
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                    {item.sublabels?.length > 0 && (
                      <button
                        className="ml-auto"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          toggleSubmenu(index);
                        }}
                      >
                        {openSubmenus[index] ? "▲" : "▼"}
                      </button>
                    )}
                  </div>

                  {/* Sublabels */}
                  {openSubmenus[index] &&
                    item.sublabels?.length > 0 && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.sublabels.map((sublabel, subIndex) => (
                          <div
                            key={subIndex}
                            className="flex items-center text-sm py-2 px-4 cursor-pointer hover:bg-green-500 hover:rounded-lg transition-all"
                            onClick={() => navigate(`/dashboard${sublabel.path}`)} // Navigate on sublabel click
                          >
                            <sublabel.icon className="w-4 h-4 mr-2" />
                            <span>{sublabel.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen scrollbar-hide">
        <div className="flex items-center justify-between bg-[#0c1014] text-white p-4 fixed top-0 left-0 right-0 z-40 md:hidden shadow-lg">
          <img
            src={dashboardConfig.logo.src}
            alt={dashboardConfig.logo.alt}
            className="h-10"
          />
          <button onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            ☰
          </button>
        </div>

        <div className="pt-16 md:pt-0">
          <Outlet />
        </div>
      </main>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => {
            setIsMobileMenuOpen(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;