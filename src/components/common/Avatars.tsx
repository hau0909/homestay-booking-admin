type AvatarProps = {
  avatarUrl?: string | null;
  email?: string;
  className?: string;
};

const Avatar = ({ avatarUrl, email, className }: AvatarProps) => {
  const firstChar = email?.charAt(0).toUpperCase() || "?";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={email}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gray-600 text-white font-semibold ${className}`}
    >
      {firstChar}
    </div>
  );
};

export default Avatar;
