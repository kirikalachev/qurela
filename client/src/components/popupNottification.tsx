"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const PopupNotification = () => {
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/account/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setUsername(response.data.username || "Потребителю");
      })
      .catch((error) => {
        console.error("Грешка при извличане на потребителското име:", error);
        setUsername("Потребителю");
      });
  }, []);

  const closePopup = () => {
    const popup = document.getElementById("popup-notification");
    if (popup) {
      popup.classList.remove("show");
    }
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  };

  const showPopup = () => {
    const popup = document.getElementById("popup-notification");
    if (popup) {
      popup.classList.add("show");
      closeTimeout.current = setTimeout(closePopup, 3000);

      popup.addEventListener("mouseenter", () => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
      });
      popup.addEventListener("mouseleave", () => {
        closeTimeout.current = setTimeout(closePopup, 2000);
      });
    }
  };

  useEffect(() => {
    localStorage.setItem("popupShowed", "true");
    setTimeout(() => {
      showPopup();
    }, 0);

    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  return (
    <div
      id="popup-notification"
      className="popup fixed bottom-5 right-5 bg-green-600 text-white p-3 rounded shadow transition-opacity duration-300 flex items-center gap-2"
    >
      Здравейте, {username}!
      <button className="close-btn text-white text-xl" onClick={closePopup}>
        &times;
      </button>
    </div>
  );
};

export default PopupNotification;
