import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-16  rounded-lg flex items-center justify-center">
        <Image
          src={"/logo1.jpg"}
          width={32}
          height={32}
          alt="logo"
          className="w-full"
        />
      </div>
      <span className="text-xl font-bold text-gray-900">koheli.com</span>
    </Link>
  );
};

export default Logo;
