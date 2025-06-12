"use client";

import ConnectWallet from "@/components/ConnectWallet";
import Quiz from "@/components/Quiz"; // Import Quiz component
import { userSession } from "@/lib/userSession";
import { useEffect, useState } from "react";

export default function Home() {
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserAddress(userData.profile.stxAddress.testnet); // Use testnet address for now
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Blockchain Quiz App</h1>
      <ConnectWallet />

      {userAddress ? (
        <div className="mt-8 w-full max-w-2xl">
          <p className="text-xl font-semibold text-gray-700 text-center mb-4">Welcome, {userAddress}!</p>
          <Quiz /> {/* Render Quiz component */}
        </div>
      ) : (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-gray-600 mt-2">Connect your wallet to start the quiz.</p>
        </div>
      )}
    </div>
  );
}
