import type React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import SocialProofPopup from "@/components/SocialProofPopup";
import WhatsApp from "@/components/whatsapp";
import Messenger from "@/components/messenger";

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
      <WhatsApp />
      <Messenger />
    </>
  );
}
