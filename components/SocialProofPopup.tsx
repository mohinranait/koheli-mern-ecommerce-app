"use client";

import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocialProofNotification } from "@/types";
import moment from "moment";

// ✅ Single Notification Card UI
function FacebookStyleNotification(data: SocialProofNotification) {
  const { image, beforeText, afterText, title, createdAt } = data || {};

  return (
    <div className="w-[300px] bg-white rounded-lg ">
      <p className="text-xs text-gray-500 mb-2">New notification</p>
      <div className="flex gap-2 items-start">
        <Avatar className="w-9 h-9 mt-1">
          <AvatarImage src={image} alt="avatar" />
          <AvatarFallback>WS</AvatarFallback>
        </Avatar>
        <div className="text-sm leading-tight">
          <p>
            <span className="font-medium">{beforeText}</span>{" "}
            <strong>{title}</strong>{" "}
            <span className="font-medium">{afterText}</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {moment(createdAt).format("hh:mm:ss A")}
          </p>
        </div>
      </div>
    </div>
  );
}

// ✅ Main Social Proof Toast Component
export default function SocialProofPopup() {
  const [notifications, setNotifications] = useState<SocialProofNotification[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const toastIdRef = useRef<Id | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Fetch data from API
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/social-proof");
      const json = await res.json();

      const activeItems = Array.isArray(json.data)
        ? json.data.filter(
            (item: SocialProofNotification) => item.status === "active"
          )
        : [];

      setNotifications(activeItems);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // ✅ Show one toast at a time
  const showNotification = () => {
    if (!notifications.length) return;

    const current = notifications[currentIndex];

    if (!toast.isActive(toastIdRef.current as Id)) {
      toastIdRef.current = toast(<FacebookStyleNotification {...current} />, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        closeButton: true,
        icon: false,
      });

      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }
  };

  // ✅ Initial data fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ Setup interval for showing notification
  useEffect(() => {
    if (!notifications.length) return;

    const startInterval = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (document.visibilityState === "visible") {
          showNotification();
        }
      }, 10000);
    };

    startInterval();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startInterval();
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [notifications, currentIndex]);

  return <ToastContainer />;
}
