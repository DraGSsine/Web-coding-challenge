import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/components/provider";


export const metadata: Metadata = {
  title: "TaskMaster ",
  description: "A simple task manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
