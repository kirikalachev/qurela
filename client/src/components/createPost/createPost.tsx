"use client";
import CustomSelect from "@/components/createPost/customSelect"
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const CreatePost = () => {

    useEffect(() => {
        // При монтиране на компонента забраняваме скролването
        document.body.style.overflow = "hidden";
    
        // При демонтиране възстановяваме скролването
        return () => {
          document.body.style.overflow = "";
        };
      }, []);

  return (
    <div className="forbid-overflow w-full h-full top-0 left-0 fixed z-[51] flex justify-center items-center">
        <span className="w-full h-full top-0 left-0 fixed bg-black z-[51] opacity-[0.7] "></span>
        <div className="p-5 flex flex-col w-[55%] h-[55%] bg-white z-[52] gap-3 rounded">
            <div className="flex-[1] flex justify-end px-2">x</div>
            <div className="flex-[15] flex flex-col items-stretched gap-4">
            <textarea className="flex-[2] p-2 outline-none border rounded border-[#A9A9AC]"
                value={"Lorem lorem ipsum lorem ipsu ipsum?"}
                >
                    
                </textarea>
                <textarea className="flex-[8] p-2 outline-none border rounded border-[#A9A9AC]"
                placeholder="За какво си мислите?"
                >
                </textarea>
            </div>
            <div className="flex-[3] flex items-center justify-between">
                <div>
                    <CustomSelect />
                </div>

                <button className="bg-safety-orange p-2">
                    Публикуване
                </button>
            </div>
        </div>
    </div>
  )
};

export default CreatePost;
