// scripts/config.ts
// This file holds configuration for deployment and contract interaction.

export const config = {
  // Replace with your actual deployer private key (e.g., from a testnet wallet)
  // IMPORTANT: Do not use this in production. Use environment variables or a secure key management system.
  deployerPrivateKey: "YOUR_DEPLOYER_PRIVATE_KEY_HERE", 

  // Deployed contract addresses will be stored here after deployment
  contractAddresses: {
    quizToken: "",
    quizContract: "",
  },

  // Network URL for deployment
  NETWORK_URL: "https://stacks-node-api.testnet.stacks.co", // Testnet API URL
  // NETWORK_URL: "https://stacks-node-api.mainnet.stacks.co", // Mainnet API URL
  // NETWORK_URL: "http://localhost:3999", // Devnet API URL
};
