import { cn } from "@/lib/utils";
import React from "react";

interface HomeLayoutProps extends React.ComponentProps<"main"> {
  children: React.ReactNode;
}

export default function HomeLayout({
  className,
  children,
  ...props
}: HomeLayoutProps) {
  return (
    <main
      className={cn("relative flex min-h-screen justify-center", className)}
      {...props}
    >
      
      {children}
    </main>
  );
}
