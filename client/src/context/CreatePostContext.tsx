"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface CreatePostContextType {
  isOpen: boolean;
  openPost: () => void;
  closePost: () => void;
  postDetails: {
    title: string;
    content: string;
    category: string; // Store selected category
  };
  categories: string[]; // Store available categories from the DB
  setCategory: (category: string) => void; // Method to update selected category
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  fetchCategories: () => void; // Method to fetch categories from DB
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(undefined);

export const CreatePostProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postDetails, setPostDetails] = useState({
    title: "",
    content: "",
    category: "", // Store category
  });
  const [categories, setCategories] = useState<string[]>([]);

  const openPost = () => setIsOpen(true);
  const closePost = () => setIsOpen(false);

  const setCategory = (category: string) => {
    setPostDetails((prevState) => ({
      ...prevState,
      category, // Update category in postDetails
    }));
  };

  const setTitle = (title: string) => {
    setPostDetails((prevState) => ({
      ...prevState,
      title, // Update title
    }));
  };

  const setContent = (content: string) => {
    setPostDetails((prevState) => ({
      ...prevState,
      content, // Update content
    }));
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/forum/categories/");
      const data = await response.json();
      setCategories(data); // Store categories fetched from DB
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <CreatePostContext.Provider
      value={{
        isOpen,
        openPost,
        closePost,
        postDetails,
        categories,
        setCategory,
        setTitle,
        setContent,
        fetchCategories,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  );
};

export const useCreatePost = () => {
  const context = useContext(CreatePostContext);
  if (!context) {
    throw new Error("useCreatePost must be used within a CreatePostProvider");
  }
  return context;
};
