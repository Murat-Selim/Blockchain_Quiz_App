"use client";

import { useConnect } from "@stacks/connect-react";
import { userSession } from "@/lib/userSession";
import { useEffect, useState } from "react";
import { UserSession } from "@stacks/connect"; // Import UserSession type

export default function ConnectWallet() {
  const { doOpenAuth } = useConnect(); // Only destructure doOpenAuth
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserAddress(userData.profile.stxAddress.testnet); // Use testnet address for now
    }
  }, []);

  const connectWallet = () => {
    doOpenAuth(true, { // Pass true for signIn, then options object
      appDetails: {
        name: "Blockchain Quiz App",
        icon: "https://example.com/logo.png", // Replace with your app's logo
      },
      userSession,
      onFinish: ({ userSession: session }: { userSession: UserSession }) => {
        const userData = session.loadUserData();
        setUserAddress(userData.profile.stxAddress.testnet);
      },
      onCancel: () => {
        console.log("Wallet connection cancelled.");
      },
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut(); // Use userSession directly for sign out
    setUserAddress("");
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      {userAddress ? (
        <div>
          <p className="text-lg font-semibold">Connected: {userAddress}</p>
          <button
            onClick={disconnectWallet}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Connect Stacks Wallet
        </button>
      )}
    </div>
  );
}
