import React from "react";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";

const InfoBar = () => {
  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <ul className="space-y-2 ">
          <li className="bg-gray-100 p-2 rounded">
            Helpline: <Link href="tel:01739825295">01739825295</Link>
          </li>
          <li className="bg-gray-100 p-2 rounded">
            Whatsapp:{" "}
            <Link href={"https://wa.me/+8801739825295"}>01739825295</Link>
          </li>
          <li className="bg-gray-100 p-2 rounded">
            Messanger:{" "}
            <Link href={"https://www.facebook.com/Kohelionline"}>
              https://www.facebook.com/Kohelionline
            </Link>{" "}
            /{" "}
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default InfoBar;
