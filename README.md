# Blockchain Quiz App

This project is a decentralized multiple-choice quiz application built on the Stacks blockchain. Users can answer questions and earn tokens for correct answers.

## Project Structure

-   `/contracts`: Clarity smart contracts
-   `/frontend`: Next.js application
-   `/scripts`: Deployment and utility scripts
-   `/tests`: Contract tests
-   `README.md`: Complete documentation

## Setup and Installation

To set up the project, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/blockchain-quiz-app.git
    cd blockchain-quiz-app
    ```

2.  **Install root dependencies (for deployment scripts):**
    ```bash
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Smart Contract Development and Deployment

The smart contracts are written in Clarity and located in the `/contracts` directory.

### Contracts Overview

-   `quiz-token.clar`: Defines a fungible token (`quiz-token`) that is rewarded to users for correct answers.
    -   `get-total-supply()`: Returns the total supply of `quiz-token`.
    -   `get-balance(owner principal)`: Returns the balance of `quiz-token` for a given principal.
    -   `mint(amount uint, recipient principal)`: Mints new tokens and sends them to a recipient (callable by contract owner).
    -   `transfer(amount uint, sender principal, recipient principal)`: Transfers tokens from sender to recipient.

-   `quiz-contract.clar`: Manages quiz questions and handles answer submissions.
    -   `add-question(question-text (string-ascii 256), options-list (list 4 (string-ascii 64)), correct-index uint)`: Adds a new question (only callable by contract owner).
    -   `get-question(question-id uint)`: Retrieves a question by its ID.
    -   `get-total-questions()`: Returns the total number of questions.
    -   `submit-answer(question-id uint, submitted-answer-index uint)`: Allows users to submit an answer. Rewards `quiz-token` if correct.

### Deployment

1.  **Configure Deployer Private Key:**
    Open `scripts/config.ts` and replace `"YOUR_DEPLOYER_PRIVATE_KEY_HERE"` with the private key of the account you want to use for deploying the contracts. **Use a testnet private key for development.**

    ```typescript
    // scripts/config.ts
    export const config = {
      deployerPrivateKey: "YOUR_TESTNET_PRIVATE_KEY", // Replace this!
      contractAddresses: {
        quizToken: "",
        quizContract: "",
      },
    };
    ```

2.  **Run Deployment Script:**
    From the root directory of the project, execute the deployment script:
    ```bash
    npm run ts-node scripts/deploy.ts
    ```
    *(Note: You might need to install `ts-node` globally or locally: `npm install -g ts-node` or `npm install ts-node`)*

    The script will deploy `quiz-token.clar` first, then `quiz-contract.clar`. After successful deployment, you will need to update the `CONTRACT_ADDRESS` in `frontend/src/config.ts` with the actual deployer address (the address associated with your `deployerPrivateKey`).

    Example: If your deployer address is `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3FYFVXJ7ASXK0`, then `CONTRACT_ADDRESS` in `frontend/src/config.ts` should be set to this.

## Frontend Development and Usage

The frontend is a Next.js application located in the `/frontend` directory.

### Running the Frontend

1.  **Update Frontend Configuration:**
    After deploying your smart contracts, open `frontend/src/config.ts` and update `CONTRACT_ADDRESS` with the deployer address you used for contract deployment.

    ```typescript
    // frontend/src/config.ts
    export const CONTRACT_ADDRESS = "YOUR_DEPLOYER_ADDRESS_HERE"; // e.g., "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3FYFVXJ7ASXK0"
    // ... other configurations
    ```

2.  **Start the Development Server:**
    From the root directory, navigate into the `frontend` directory and start the Next.js development server:
    ```bash
    cd frontend
    npm run dev
    ```
    The application will be accessible at `http://localhost:3000`.

### User Guide

1.  **Connect Wallet:** On the home page, click the "Connect Stacks Wallet" button. This will prompt you to connect your Hiro Wallet (or other Stacks-compatible wallet).
2.  **Take the Quiz:** Once connected, the quiz interface will appear.
    *   Questions will be displayed one by one.
    *   Select your answer by clicking on one of the options.
    *   Click "Submit Answer" to send your answer to the blockchain. Your wallet will prompt you to confirm the transaction.
    *   If your answer is correct, you will receive `quiz-token` rewards.
    *   Use "Previous" and "Next" buttons to navigate between questions.
3.  **Disconnect Wallet:** Click "Disconnect Wallet" to sign out of your Stacks wallet.

## Testing

Contract tests are located in the `/tests` directory.

1.  **Install Clarity CLI (if not already installed):**
    Follow the instructions here: [https://docs.stacks.co/docs/clarity/clarity-cli](https://docs.stacks.co/docs/clarity/clarity-cli)

2.  **Run Contract Tests:**
    From the root directory, you can run Clarity tests using the Clarity CLI:
    ```bash
    clarity-cli test tests/quiz-contract_test.ts
    ```
    *(Note: You will need to create actual test files in the `tests` directory. The above command is an example.)*

## Deliverables

-   Complete source code for all components (`contracts`, `frontend`, `scripts`, `lib`, `components`).
-   Step-by-step setup instructions.
-   Smart contract deployment guide.
-   Frontend deployment instructions.
-   Testing procedures.
