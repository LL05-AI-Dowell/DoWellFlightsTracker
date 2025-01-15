import React from 'react'
import AirportSearch from '../Components/SearchForm';
import MapComponent from '../Components/MapComponent';
import SearchFormMobile from './SearchFormMobile';
import mobilelogo from "../../assets/mobilelogo.png"
const FlightTrackerPageMobileView = () => {
  return (
    <div>
      <div className=" h-screen overflow-hidden ">

        <div className='fixed w-full h-screen  bg-white z-99'></div>
        <div className=" w-full h-[12vh]  ">
          <img
            className="h-full "
            src={mobilelogo}
            alt="logo"
          />
        </div>
        <div className="p-5 h-[55vh] mb-[5vh] ">
          <MapComponent />
        </div>

        <div className="h-[28vh] px-3 w-full ">
          <SearchFormMobile/>
        </div>
        
      </div>
    </div>
  );
}

export default FlightTrackerPageMobileView