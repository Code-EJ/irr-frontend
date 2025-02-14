import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onSelect: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-40 px-4 py-2 text-sm font-medium bg-white border rounded-md shadow-sm hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label} <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 w-40 mt-2 bg-white border rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center ${
                selected.includes(option) ? "font-bold text-blue-600" : ""
              }`}
              onClick={() => onSelect(option)}
            >
              {selected.includes(option) && <Check className="w-4 h-4 mr-2" />}
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
