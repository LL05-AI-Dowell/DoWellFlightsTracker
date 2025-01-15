import React, { useContext } from "react";
import { ArrowDown, RotateCcw, Search } from "lucide-react";
import { AppContext } from "../../ContextApi/ContextApi";

const SearchFormMobile = () => {
     const {
        searchRadius,
        setSearchRadius,
        dateTime,
        setDateTime,
        typeOfStatus,
        setTypeOfStatus,
      
      } = useContext(AppContext);
    


  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setDateTime({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: dateTime.hour,
      minute: dateTime.minute,
    });
  };

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    setDateTime((prev) => ({
      ...prev,
      hour: hours,
      minute: minutes,
    }));
  };

    const calculateSliderPercentage = (value) => {
      return ((value - 10) / (1000 - 10)) * 100;
    };

  return (
    <div className="bg-[#002147] h-full text-white p-5 text-sm rounded-t-lg">
      <style>
        {`
          .slider-thumb {
            position: absolute;
            height: 10px;
            width: 10px;
            background: white;
            border-radius: 50%;
            top: 50%;
            right: 0;
            transform: translate(50%, -50%);
          }
          
          input[type="date"]::-webkit-calendar-picker-indicator,
          input[type="time"]::-webkit-calendar-picker-indicator {
            filter: invert(0);
            opacity: 1;
            cursor: pointer;
          }
          
          input[type="date"],
          input[type="time"] {
            color-scheme: dark;
          }
        `}
      </style>
      <div className="flex flex-wrap  gap-6 items-center justify-between">
        <div className="flex  items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={typeOfStatus === "dep"}
              onChange={() => setTypeOfStatus("dep")}
              className="w-5 h-5"
            />
            <span className="">Departure</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={typeOfStatus === "arr"}
              onChange={() => setTypeOfStatus("arr")}
              className="w-5 h-5"
            />
            <span className="">Arrival</span>
          </label>
        </div>

        <div className="flex items-center gap-4 ">
          <input
            type="date"
            value={`${dateTime.year}-${String(dateTime.month).padStart(
              2,
              "0"
            )}-${String(dateTime.day).padStart(2, "0")}`}
            onChange={handleDateChange}
            className="bg-transparent border-2 border-white/20 text-white placeholder-gray-200 focus:outline-none rounded-full px-3 py-1 "
          />

          <input
            type="time"
            value={`${String(dateTime.hour).padStart(2, "0")}:${String(
              dateTime.minute
            ).padStart(2, "0")}`}
            onChange={handleTimeChange}
            className="bg-transparent border-2 border-white/20 text-white placeholder-gray-200 focus:outline-none rounded-full px-3 py-1 "
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span className="">Distance to airport</span>
          <span className="">
            {searchRadius} Miles / {Math.round(searchRadius * 1.60934)} KM
          </span>
        </div>
        <div className="relative pt-1">
          <div className="h-1 bg-[#34d399]/20 rounded-full">
            <div
              className="absolute h-1 bg-[#34d399] rounded-full"
              style={{
                width: `${calculateSliderPercentage(searchRadius)}%`,
              }}
            >
              <div className="slider-thumb"></div>
            </div>
          </div>
          <input
            type="range"
            min="10"
            max="1000"
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
            className="absolute top-0 w-full h-1 opacity-0 cursor-pointer"
          />
          <div className="flex justify-between text-xs mt-1 text-neutral-400">
            <span>10</span>
            <span>1000</span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between ">
        <button className="w-[50px] h-[50px] flex justify-center items-center bg-white/10 hover:bg-white/20 transition-colors rounded-full">
          <RotateCcw className="w-6 h-6" />
        </button>
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-[5vw] py-3 text-lg">
          <span>Nearby Airports</span>
          <ArrowDown className="w-6 h-6" />
        </button>
        <button className="w-[50px] h-[50px] flex justify-center items-center bg-green-500 hover:bg-green-600 transition-colors rounded-full">
          <Search className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SearchFormMobile;
