"use client";
import CustomSelect from "@/components/createPost/customSelect";
import { useEffect, useState } from "react";
import { useCreatePost } from "@/context/CreatePostContext";


const CreatePost = () => {
    const { isOpen, closePost } = useCreatePost();

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

  return (
    <div className="forbid-overflow w-full h-full top-0 left-0 fixed z-[51] flex justify-center items-center">
      {/* Background overlay to close modal */}
      <span
        className="cursor-pointer w-full h-full top-0 left-0 fixed bg-black z-[51] opacity-[0.7]"
        onClick={closePost}
        ></span>

      <div className="p-5 flex flex-col w-[55%] h-[55%] bg-white z-[52] gap-3 rounded">
        <div className="flex-[1] flex items-center justify-between px-2 select-none">
          <h2 className="text-xl font-medium">Създай публикация</h2>
          <button onClick={closePost} className="text-xl cursor-pointer">x</button>
        </div>
        <div className="flex-[15] flex flex-col items-stretched gap-4">
          <textarea
            className="flex-[2] p-2 outline-none border rounded border-[#A9A9AC]"
          />
          <textarea
            className="flex-[8] p-2 outline-none border rounded border-[#A9A9AC]"
            placeholder="За какво си мислите?"
          />
        </div>
        <div className="flex-[3] flex items-center justify-between">
          <div>
            <CustomSelect />
          </div>
          <button className="bg-safety-orange p-2 select-none" onClick={closePost}>Публикуване</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
