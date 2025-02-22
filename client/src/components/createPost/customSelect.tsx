// forum/selectOption.tsx
'use client';

import { useState, useRef, useEffect } from "react";

interface SelectOptionProps {
  onChange: (value: string) => void;
}

export default function SelectOption({ onChange }: SelectOptionProps) {
  const options = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 21",
    "Option 22",
    "Option 23",
  ];
  const extraOption = "Други";

  const [selected, setSelected] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedOptions =
    filteredOptions.length > 0 ? [...filteredOptions, extraOption] : [extraOption];

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-34" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Изберете тема"
        className="dark:bg-d-charcoal w-full p-2 bg-white border border-gray-300 rounded-lg shadow-md text-left focus:ring-2 focus:ring-blue-500"
      />
      {isOpen && (
        <ul className="dark:bg-d-charcoal overflow-y-auto absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40">
          {displayedOptions.map((option) => (
            <li
              key={option}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                setSelected(option);
                setSearchTerm(option);
                setIsOpen(false);
                onChange(option);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
