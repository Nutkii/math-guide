import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Math Guide",
  description: "Georgian math textbook solutions, AI help, and live tutors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
