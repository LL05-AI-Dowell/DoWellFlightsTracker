import React from 'react'
import LanguageImage from "../../assets/images/NavbarImages/LanguageSign.svg"


export const Navbar = () => {
  return (
    <div className="w-full h-[80px] rounded-md bg-gradient-to-br from-slate-900 to-slate-800 relative flex justify-between items-center px-[30px] ">
      <h1 className="font-semibold text-2xl max-sm:text-lg">
        DoWell Flight Tracker
      </h1>
      <div className="flex gap-4 ">
        <img src={LanguageImage} alt="" />
        <div className="w-[2px] h-[40px] bg-[#3F3F3F] "></div>
        <div className="flex  items-center gap-4">
          <div className="w-[40px] h-[40px] bg-gray-400 rounded-full overflow-hidden">
            <img  src={""} alt="" />
          </div>
          <div className="max-sm:hidden">
            <h1>Admin</h1>
            <h1 className="text-xs">admin@domain.ae</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
