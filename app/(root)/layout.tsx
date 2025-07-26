import type React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import SocialProofPopup from "@/components/SocialProofPopup";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <Toaster />
      <SocialProofPopup />
    </>
  );
}
