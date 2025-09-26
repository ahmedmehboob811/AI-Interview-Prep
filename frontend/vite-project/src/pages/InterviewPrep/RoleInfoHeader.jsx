import React from "react";

const RoleInfoHeader = ({
  role,
  topicToFocus,
  experience,
  questions,
  lastUpdated,
}) => {
  return (
    <div className="h-[200px] relative bg-white shadow-md rounded-2xl p-6 overflow-hidden">
      {/* Gradient Blobs */}
      <div className="absolute top-0 right-0 w-[40vw] md:w-[30vw] h-[200px] flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="w-16 h-16 bg-lime-400 blur-[65px] animate-blob1">
          <div className="w-16 h-16 bg-teal-400 blur-[65px] animate-blob2">
            <div className="w-16 h-16 bg-cyan-300 blur-[45px] animate-blob3">
              <div className="w-16 h-16 bg-fuchsia-200 blur-[45px] animate-blob1" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col">
          <h2 className="text-2xl font-medium">{role}</h2>
          <p className="text-sm text-gray-900 mt-1">{topicToFocus}</p>
        </div>

        {/* Meta info badges */}
        <div className="flex flex-wrap items-center gap-3 mt-6 mb-20">
          <span className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-full">
            Experience: {experience} {Number(experience) === 1 ? "Year" : "Years"}
          </span>

          <span className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-full">
            {questions} Q&A
          </span>

          <span className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-full">
            Last updated: {lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;
