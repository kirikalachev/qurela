'use client';
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import ProfileAvatar from "@/components/profileAvatar";

interface ProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profilePic: string | null;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }
  
    axios
      .get("http://127.0.0.1:8000/api/account/", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setProfileData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response?.data?.detail || "Failed to fetch profile data.");
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
    if (!token || !profileData) {
      router.push("/auth/signin");
      return;
    }
  
    const formData = new FormData();
    formData.append("email", profileData.email);
    formData.append("first_name", profileData.first_name);
    formData.append("last_name", profileData.last_name);
    formData.append("username", profileData.username);
    if (selectedFile) {
      formData.append("profilePic", selectedFile);
    }
  
    try {
      await axios.put("http://127.0.0.1:8000/api/account/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
  
      window.location.reload();
    } catch (error: any) {
      setError(error.response?.data?.detail || "Failed to update profile data.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!profileData) return <p>No profile data available.</p>;

  return (
    <main className="w-full flex justify-center bg-gray-100 py-[12vh]">
      <div className="w-[600px] bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center border-b pb-4">
          <ProfileAvatar
            profilePic={profileData.profilePic}
            username={profileData.username}
          />
          <label className="mt-3 cursor-pointer text-blue-600 hover:underline">
            Change Profile Picture
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* You can re-enable first/last name inputs if desired */}
          {/* <div>
            <label className="block font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={profileData?.first_name || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={profileData?.last_name || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          <div>
            <label className="block font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={profileData?.username || ""}
              onChange={handleInputChange}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profileData?.email || ""}
              disabled
              className="w-full border bg-gray-100 rounded-md px-3 py-2 cursor-not-allowed"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700">
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
};

export default Profile;
