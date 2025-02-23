'use client';
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface ProfileData {
  username: string;
  email: string;
  name: string;
  profilePic: string | null; 
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      console.error("Няма токен, пренасочване към вход...");
      router.push("/auth/signin");
      return;
    }

    // Fetch profile data
    axios
      .get("http://127.0.0.1:8000/api/account/", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
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

    // Fetch user's posts
// Fetch user's posts
axios
  .get("http://127.0.0.1:8000/my_posts/", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  })
  .then((response) => {
    console.log(response.data);  // Проверка на отговор
    setUserPosts(response.data.published_posts);
    setLoading(false);
  })
  .catch((error) => {
    console.error("Error fetching user posts:", error);
    setError(
      error.response?.data?.detail || "Неуспешно зареждане на публикациите."
    );
    if (error.response?.status === 401) {
      router.push("/auth/signin");
    }
    setLoading(false);
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
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

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
      setSelectedFile(null);
      setError(null); // Clear error if update is successful
    } catch (error: any) {
      console.error("Грешка при обновяване на данните за профила:", error);
      setError(
        error.response?.data?.detail ||
          "Неуспешно обновяване на данните за профила."
      );
    }
  };

  if (loading) {
    return <p>Зареждане...</p>;
  }

  if (error) {
    return <p className="text-red-500">Грешка: {error}</p>;
  }

  if (!profileData) {
    return <p>Няма налични данни за профила.</p>;
  }

  return (
    <main className="pt-12 w-full mx-auto flex items-start justify-center gap-10 dark:text-d-cadet-gray">
      <div className="flex-[2] p-10">
        <div className="p-5 h-[500px] bg-platinum-gray dark:bg-d-rich-black rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Профил на акаунта</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture */}
            <div>
              <label htmlFor="profilePic" className="block font-medium">
                Профилна снимка
              </label>
              {profileData.profilePic && (
                <img
                  src={profileData.profilePic}
                  alt="Profile Picture"
                  className="w-24 h-24 rounded-full mb-2"
                />
              )}
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-d-charcoal"
              />
            </div>

            {/* Input fields for profile data */}
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
                className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-d-charcoal"
              />
            </div>
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
                className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-d-charcoal"
              />
            </div>
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
                className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-d-charcoal"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Запази промените
            </button>
          </form>
        </div>
      </div>
      <div className="flex-[3] p-10 h-[500px]">
        <h2 className="text-xl font-semibold mb-2">Моите публикации</h2>
        <div className="flex flex-col gap-4 overflow-y-auto h-[480px]">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-xl shadow-md dark:bg-d-rich-black">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-gray-700">{post.content}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>Нямате публикувани постове.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;
