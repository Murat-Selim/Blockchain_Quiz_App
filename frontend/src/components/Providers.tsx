"use client";

import { Connect } from "@stacks/connect-react";
import { userSession } from "@/lib/userSession";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "Blockchain Quiz App",
          icon: "https://example.com/logo.png", // Replace with your app's logo
        },
        redirectTo: "/",
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
    >
      {children}
    </Connect>
  );
}
