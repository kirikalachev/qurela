"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const PopupNotification = () => {
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [username, setUsername] = useState("Потребителю");

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      console.warn("No token found, skipping user fetch.");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/account/", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setUsername(response.data.username || "Потребителю");
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
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
    setTimeout(showPopup, 0);

    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, [showPopup]);

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
