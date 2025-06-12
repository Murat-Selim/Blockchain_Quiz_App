// tests/quiz-contract_test.ts
// This is a placeholder test file. You will need to install Clarity CLI and write actual tests.

// Example of how you might structure a test (requires Clarity CLI and test runner setup)
/*
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
    name: "quiz-contract: add-question works",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get("deployer")!;
        let wallet1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
            Tx.contractCall(
                "quiz-contract",
                "add-question",
                [
                    types.ascii("What is the capital of France?"),
                    types.list([
                        types.ascii("Berlin"),
                        types.ascii("Paris"),
                        types.ascii("Rome"),
                        types.ascii("Madrid")
                    ]),
                    types.uint(1) // Paris is at index 1
                ],
                deployer.address
            ),
        ]);

        // Assert that the transaction was successful
        block.receipts[0].result.expectOk().expectUint(0);

        // Verify the question was added
        let question = chain.callReadOnlyFn(
            "quiz-contract",
            "get-question",
            [types.uint(0)],
            deployer.address
        );
        question.result.expectOk().expectSomeTuple();
    },
});

Clarinet.test({
    name: "quiz-contract: submit-answer works for correct answer",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get("deployer")!;
        let wallet1 = accounts.get("wallet_1")!;

        // First, add a question
        chain.mineBlock([
            Tx.contractCall(
                "quiz-contract",
                "add-question",
                [
                    types.ascii("What is 1 + 1?"),
                    types.list([
                        types.ascii("1"),
                        types.ascii("2"),
                        types.ascii("3"),
                        types.ascii("4")
                    ]),
                    types.uint(1) // 2 is at index 1
                ],
                deployer.address
            ),
        ]);

        // Submit correct answer
        let block = chain.mineBlock([
            Tx.contractCall(
                "quiz-contract",
                "submit-answer",
                [
                    types.uint(0), // Question ID
                    types.uint(1)  // Correct answer index
                ],
                wallet1.address
            ),
        ]);

        // Assert that the transaction was successful and returned true (correct)
        block.receipts[0].result.expectOk().expectBool(true);

        // Verify wallet1 received tokens (assuming quiz-token is deployed and linked)
        let balance = chain.callReadOnlyFn(
            "quiz-token",
            "get-balance",
            [types.principal(wallet1.address)],
            deployer.address
        );
        balance.result.expectOk().expectUint(10); // Assuming REWARD_AMOUNT is 10
    },
});
*/
