interface ProfileAvatarProps {
    profilePic: string | null;
    username: string;
  }
  
  const ProfileAvatar = ({ profilePic, username }: ProfileAvatarProps) => {
    return profilePic ? (
      <img
        src={profilePic}
        alt="Profile Picture"
        className="w-10 h-10 rounded-full border"
      />
    ) : (
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
        {username?.[0]?.toUpperCase() || "?"}
      </div>
    );
  };
  
  export default ProfileAvatar;
  