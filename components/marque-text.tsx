"use client";
import { useAppSelector } from "@/hooks/useRedux";
import React from "react";
import Marquee from "react-fast-marquee";

const MarqueText = () => {
  const { site } = useAppSelector((state) => state.site);

  return (
    <>
      {site?.marqueStatus ? (
        <div className="h-8 text-white flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
          <Marquee>{site?.marque}</Marquee>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default MarqueText;
