import React from "react";

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-emerald-500",
];

const UserAvatar = ({
  user,
  size = "w-10 h-10",
  textSize = "text-lg",
  className = "",
}) => {
  const name = user?.name || "User";

  const color =
    colors[
      name.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
        colors.length
    ];

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={name}
        className={`${size} rounded-full border-2 border-gray object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${size}
        ${textSize}
        ${color}
        rounded-full
        flex
        items-center
        justify-center
        font-semibold
        text-white
        uppercase
        select-none
        ${className}
      `}
    >
      {name.charAt(0)}
    </div>
  );
};

export default UserAvatar;
