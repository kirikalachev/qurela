"use client";
import { useState } from 'react';

const CopyText = () => {
    const [message, setmessage] = useState(false);
    function systemMessage(e:string) {
        console.log(e);
        setmessage(true);
        return (
            <div className="bg-red-500 p-[20%] w-[100%] h-[100vh] fixed">
                Copied
            </div>
        )
    }

    const element = document.querySelector('.copy-text');

    if (element && element.textContent) {
      navigator.clipboard.writeText(element.textContent)
        .then(() => {
            systemMessage("Copied!!!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    } else {
    }

    return ( <div>
        {message && (
            <div>
            </div>
        )}
    </div>
    )
  };
  
export default CopyText;