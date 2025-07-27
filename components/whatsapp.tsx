import Image from "next/image";
import Link from "next/link";
import React from "react";

const WhatsApp = () => {
  return (
    <Link
      href={"https://wa.me/+8801710060020"}
      target="_blank"
      className="h-12 w-12 rounded-full overflow-hidden  right-2 bottom-20 fixed"
    >
      <Image src={"/WhatsApp.webp"} width={40} height={40} alt="Whatsapp" />
    </Link>
  );
};

export default WhatsApp;
