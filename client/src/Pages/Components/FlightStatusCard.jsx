import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plane,
  Clock,
  DoorOpen,
  BaggageClaim,
} from "lucide-react";

const FlightStatusCard = ({ flight }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatMinutesToHoursAndMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const calculateRemainingTime = (scheduledBlockMinutes, taxiOutMinutes) => {
    const remainingMinutes = scheduledBlockMinutes - taxiOutMinutes;
    return formatMinutesToHoursAndMinutes(remainingMinutes);
  };

  const getDelayInfo = () => {
    if (!flight.delays) return null;
    const delays = [];
    if (flight.delays.departureGateDelayMinutes) {
      delays.push(
        `Departure delayed by ${formatMinutesToHoursAndMinutes(
          flight.delays.departureGateDelayMinutes
        )} `
      );
    }
    if (flight.delays.arrivalGateDelayMinutes) {
      delays.push(
        `Arrival delayed by ${formatMinutesToHoursAndMinutes(
          flight.delays.arrivalGateDelayMinutes
        )} `
      );
    }
    return delays;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 w-full text-white rounded-2xl p-8 mb-4 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Plane className="text-blue-400" size={24} />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            {flight.carrierFsCode} {flight.flightNumber}
          </span>
        </div>

        <div className="">
          <span
            className={`px-3 py-1  rounded-full text-sm font-medium ${
              flight.status === "L"
                ? "bg-green-500/20 text-green-400"
                : flight.status === "A"
                ? "bg-blue-500/20 text-blue-400"
                : flight.status === "S"
                ? "bg-yellow-500/20 text-yellow-400"
                : flight.status === "D"
                ? "bg-orange-500/20 text-orange-400"
                : flight.status === "C"
                ? "bg-red-500/20 text-red-400"
                : flight.status === "R"
                ? "bg-purple-500/20 text-purple-400"
                : flight.status === "U"
                ? "bg-gray-500/20 text-gray-400"
                : "bg-gray-600/50 text-gray-300"
            }`}
          >
            {(() => {
              switch (flight.status) {
                case "L":
                  return "Landed";
                case "A":
                  return "In Flight";
                case "S":
                  return "Scheduled";
                case "D":
                  return "Departed";
                case "C":
                  return "Cancelled";
                case "R":
                  return "Redirected";
                case "U":
                  return "Unknown";
                default:
                  return flight.status;
              }
            })()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 relative">
        <div className="space-y-2">
          <div className="text-sm text-gray-400">
            {new Date(flight.departureDate.dateLocal).toLocaleDateString()}
          </div>
          <div className="text-2xl font-bold">
            {new Date(flight.departureDate.dateLocal).toLocaleTimeString(
              "en-US",
              { hour: "2-digit", minute: "2-digit" }
            )}
          </div>
          <div className="text-4xl font-bold text-[var(--primary-color-green)] mt-2">
            {flight.departureAirportFsCode}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center relative">
          <div className="text-sm text-gray-400 mb-2">
            Duration
            <span className="text-white ml-1">
              {formatMinutesToHoursAndMinutes(
                flight.flightDurations.scheduledBlockMinutes
              )}
            </span>
          </div>

          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent my-4">
            <div className="relative">
              <Plane
                className="text-blue-400 absolute  -top-4 left-1/2 transform -translate-x-1/2 "
                size={30}
              />
            </div>
          </div>

          {flight.flightDurations.taxiOutMinutes && (
            <div className="text-sm text-gray-400 mb-2">
              Remaining Time
              <span className="text-white">
                {" "}
                :{" "}
                {calculateRemainingTime(
                  flight.flightDurations.scheduledBlockMinutes,
                  flight.flightDurations.taxiOutMinutes
                )}
              </span>
            </div>
          )}

          <div className="text-sm text-gray-400">Direct Flight</div>
        </div>

        <div className="space-y-2 text-right">
          <div className="text-sm text-gray-400">
            {new Date(flight.arrivalDate.dateLocal).toLocaleDateString()}
          </div>
          <div className="text-2xl font-bold">
            {new Date(flight.arrivalDate.dateLocal).toLocaleTimeString(
              "en-US",
              { hour: "2-digit", minute: "2-digit" }
            )}
          </div>
          <div className="text-4xl font-bold text-[var(--primary-color-green)] mt-2">
            {flight.arrivalAirportFsCode}
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showDetails ? "max-h-[400px]  opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-6 pt-6 border-t border-gray-700/50 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Plane
                  className="text-[var(--primary-color-green)]"
                  size={20}
                />
                <div>
                  <div className="text-sm text-gray-400">Flight Id</div>
                  <div className="text-base">{flight.flightId}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Plane
                  className="text-[var(--primary-color-green)]"
                  size={20}
                />
                <div>
                  <div className="text-sm text-gray-400">Aircraft</div>
                  <div className="text-base">
                    {flight.flightEquipment.actualEquipmentIataCode} -{" "}
                    {flight.flightEquipment.tailNumber}
                  </div>
                </div>
              </div>
            </div>

            {flight.airportResources.baggage && (
              <div className="bg-slate-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <BaggageClaim
                    className="text-[var(--primary-color-green)]"
                    size={20}
                  />
                  <div>
                    <div className="text-sm text-gray-400">Baggage Claim</div>
                    <div className="text-base">
                      {flight.airportResources.baggage}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <DoorOpen
                className="text-[var(--primary-color-green)]"
                size={20}
              />

              <div>
                <div className="text-sm text-gray-400">Gates</div>
                <div className="text-base">
                  <span>
                    Departure: Terminal{" "}
                    {flight.airportResources.departureTerminal}, Gate{" "}
                    {flight.airportResources.departureGate}
                    {flight.airportResources.arrivalTerminal &&
                      ` | Arrival: Terminal ${flight.airportResources.arrivalTerminal}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {getDelayInfo()?.length > 0 && (
            <div className="bg-orange-950/30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="text-orange-400" size={20} />
                <div>
                  <div className="text-sm text-orange-400">Delays</div>
                  <div className="text-base">{getDelayInfo().join(" | ")}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mt-6 py-2 flex items-center justify-center gap-2 text-[var(--primary-color-green)] hover:text-emerald-300 transition-colors duration-200"
      >
        {showDetails ? (
          <>
            <span>Show Less</span>
            <ChevronUp size={20} />
          </>
        ) : (
          <>
            <span>Show More Details</span>
            <ChevronDown size={20} />
          </>
        )}
      </button>

      
    </div>
  );
};

export default FlightStatusCard;
