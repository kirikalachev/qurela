'use client';

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface SelectOptionProps {
  onChange: (value: string) => void;
}

export default function SelectOption({ onChange }: SelectOptionProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Проверка дали потребителят е автентикиран чрез cookie "token"
  const isAuthenticated = () => {
    const token = Cookies.get("token");
    return !!token;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      // Ако потребителят не е автентикиран, пренасочваме към логин страницата
      router.push("/auth/signin");
      return;
    }

    const fetchCategories = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get("http://127.0.0.1:8000/forum/categories/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Categories fetched successfully:", response.data);
        // Ако API-то връща масив от обекти, мапваме ги към масив от имена
        if (Array.isArray(response.data)) {
          const categories = response.data.map((cat: any) => cat.name);
          setOptions(categories);
        } else {
          setError("Неуспешно зареждане на категории.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Неуспешно зареждане на категории.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, [router]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedOptions =
    [...filteredOptions];

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

  if (loading) {
    return <div>Зареждане...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

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
