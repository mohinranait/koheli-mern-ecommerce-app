import Image from "next/image";
import Link from "next/link";
import React from "react";

const Messenger = () => {
  return (
    <Link
      href={"https://www.facebook.com/Kohelionline"}
      target="_blank"
      className="h-12 w-12 rounded-full overflow-hidden  right-2 bottom-5 fixed"
    >
      <Image
        src={"/facebook-messenger.png"}
        width={40}
        height={40}
        alt="Messenger"
      />
    </Link>
  );
};

export default Messenger;
