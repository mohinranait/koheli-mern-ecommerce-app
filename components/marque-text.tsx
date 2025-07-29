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
          <Marquee
            speed={40}
            gradient={false}
            pauseOnHover={true}
            pauseOnClick={true}
          >
            <span className="mr-32  md:mr-12 lg:mr-16 xl:mr-20">
              {site?.marque}
            </span>
          </Marquee>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default MarqueText;
