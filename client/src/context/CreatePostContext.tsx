"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface CreatePostContextType {
  isOpen: boolean;
  openPost: () => void;
  closePost: () => void;
  postDetails: {
    title: string;
    content: string;
    category: string; 
  };
  categories: string[]; 
  setCategory: (category: string) => void; 
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  fetchCategories: () => void; 
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(undefined);

export const CreatePostProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postDetails, setPostDetails] = useState({
    title: "",
    content: "",
    category: "", 
  });
  const [categories, setCategories] = useState<string[]>([]);

  const openPost = () => setIsOpen(true);
  const closePost = () => setIsOpen(false);

  const setCategory = (category: string) => {
    setPostDetails((prevState) => ({
      ...prevState,
      category, 
    }));
  };

  const setTitle = (title: string) => {
    setPostDetails((prevState) => ({
      ...prevState,
      title, 
    }));
  };

  const setContent = (content: string) => {
    setPostDetails((prevState) => ({
      ...prevState,
      content, 
    }));
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/forum/categories/");
      const data = await response.json();
      setCategories(data); 
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
