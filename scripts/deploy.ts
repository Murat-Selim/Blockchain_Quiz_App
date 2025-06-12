// Removed StacksTestnet import due to persistent errors
import { AnchorMode, broadcastTransaction, makeContractDeploy, PostConditionMode } from '@stacks/transactions';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { config } from './config';

// Function to deploy a contract
async function deployContract(contractName: string, contractFilePath: string, network: any, senderKey: string, nonce: number) {
  console.log(`Deploying ${contractName}...`);
  const codeBody = readFileSync(resolve(__dirname, contractFilePath)).toString();

  const transaction = await makeContractDeploy({
    contractName,
    codeBody,
    senderKey,
    network,
    fee: 100000, // Adjust fee as needed
    nonce,
    postConditionMode: PostConditionMode.Allow,
    anchorMode: AnchorMode.Any,
  } as any); // Cast to any to bypass type checking for anchorMode

  const broadcastResponse = await broadcastTransaction({ // Pass an object
    transaction,
    network,
  });
  console.log(`Broadcast response for ${contractName}:`, broadcastResponse);

  if ('error' in broadcastResponse && broadcastResponse.error) {
    throw new Error(`Failed to deploy ${contractName}: ${broadcastResponse.error}`);
  }

  console.log(`${contractName} deployed! Transaction ID: ${broadcastResponse.txid}`);
  return broadcastResponse.txid;
}

async function main() {
  // Dynamically import StacksTestnet to bypass static type checking issues
  const { StacksTestnet } = require('@stacks/network');
  const network = new StacksTestnet({ url: config.NETWORK_URL });
  const senderKey = config.deployerPrivateKey; // Ensure this is set in config.ts

  if (!senderKey) {
    console.error("Deployer private key not found in config. Please set config.deployerPrivateKey.");
    process.exit(1);
  }

  let nonce = 0; // Start nonce, increment for each transaction

  try {
    // 1. Deploy quiz-token.clar
    const quizTokenTxId = await deployContract('quiz-token', '../contracts/quiz-token.clar', network, senderKey, nonce++);
    console.log(`Quiz Token Contract deployed with TX ID: ${quizTokenTxId}`);

    // Wait for the transaction to confirm (in a real scenario, you'd poll the API)
    // For now, a simple delay
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 2. Deploy quiz-contract.clar
    const quizContractTxId = await deployContract('quiz-contract', '../contracts/quiz-contract.clar', network, senderKey, nonce++);
    console.log(`Quiz Contract deployed with TX ID: ${quizContractTxId}`);

    console.log("Deployment complete!");
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main();
