"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface CreatePostContextType {
    isOpen: boolean;
    openPost: () => void;
    closePost: () => void;
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(undefined);

export const CreatePostProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openPost = () => setIsOpen(true);
    const closePost = () => setIsOpen(false);

    return (
        <CreatePostContext.Provider value={{ isOpen, openPost, closePost }}>
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
