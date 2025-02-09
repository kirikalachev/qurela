'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProfileData {
  username: string;
  email: string;
  name: string;
  profilePic: string; // URL към текущата профилна снимка
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Вземане на JWT token

    if (!token) {
      console.error("Няма токен, пренасочване към вход...");
      router.push("/auth/signin");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/account/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        // API-то трябва да върне обект с полетата: username, email, name и profilePic
        setProfileData(response.data);
      })
      .catch((error) => {
        console.error("Грешка при извличане на данни за профила:", error);
        setError(
          error.response?.data?.detail ||
            "Неуспешно извличане на данни за профила."
        );
        if (error.response?.status === 401) {
          router.push("/auth/signin");
        }
      });
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (profileData) {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    // Използваме FormData, за да може да се изпрати и файл
    const formData = new FormData();
    formData.append("email", profileData!.email);
    formData.append("name", profileData!.name);
    formData.append("username", profileData!.username);
    if (selectedFile) {
      formData.append("profilePic", selectedFile);
    }

    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/api/account/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setProfileData(response.data);
      setSelectedFile(null); // Изчистваме избрания файл след успешно обновяване
      // Може да добавите и уведомление за успешна актуализация
    } catch (error: any) {
      console.error("Грешка при обновяване на данните за профила:", error);
      setError(
        error.response?.data?.detail ||
          "Неуспешно обновяване на данните за профила."
      );
    }
  };

  if (error) {
    return <p className="text-red-500">Грешка: {error}</p>;
  }

  if (!profileData) {
    return <p>Зареждане...</p>;
  }

  return (
    <main className="pt-12 max-w-md mx-auto flex justify-center">
      <div className="p-5 h-[500px] bg-platinum-gray rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Профил на акаунта</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
                {/* Снимка */}
                <div>
          <label htmlFor="profilePic" className="block font-medium">
            Профилна снимка
          </label>
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {/* Преглед на текущата/избраната снимка */}
          <div className="mt-2">
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full"
              />
            ) : profileData.profilePic ? (
              <img
                src={profileData.profilePic}
                alt="Профилна снимка"
                className="w-32 h-32 object-cover rounded-full"
              />
            ) : null}
          </div>
        </div>

        {/* Име */}
        <div>
          <label htmlFor="name" className="block font-medium">
            Име
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
             
          />
        </div>

        {/* Потребителско име */}
        <div>
          <label htmlFor="username" className="block font-medium">
            Потребителско име
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={profileData.username}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
             
          />
        </div>

                  {/* Имейл */}
        <div>
          <label htmlFor="email" className="block font-medium">
            Имейл
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
             
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Запази промените
        </button>
      </form>
      </div>
    </main>
  );
};

export default Profile;
