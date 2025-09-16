import React from "react";

const SummaryCard = ({
  colors,
  role,
  topicToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      className={`p-4 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer ${colors}`}
      onClick={onSelect}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold text-gray-800">{role}</h3>
          <p className="text-sm text-gray-600">{topicToFocus}</p>
        </div>

        {/* Body */}
        <div className="mt-3">
          <p className="text-sm">
            <span className="font-semibold">Experience:</span> {experience} yrs
          </p>
          <p className="text-sm">
            <span className="font-semibold">Questions:</span> {questions}
          </p>
          <p className="text-sm text-gray-700 mt-2">{description}</p>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>Last Updated: {lastUpdated}</span>
          <button
            className="text-red-500 hover:text-red-700 font-medium"
            onClick={(e) => {
              e.stopPropagation(); // prevent card click
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
