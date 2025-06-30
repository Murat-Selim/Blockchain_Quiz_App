;; quiz-token.clar
;; This contract defines a fungible token (FT) for the Blockchain Quiz App.
;; Tokens are minted and transferred as rewards for correct quiz answers.

(impl-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token quiz-token)

;; @desc Get the total supply of the quiz token.
;; @returns (uint) The total supply of the token.
(define-read-only (get-total-supply)
  (ok (ft-get-supply quiz-token))
)

;; @desc Get the balance of the quiz token for a specific principal.
;; @param owner (principal) The principal whose balance is to be retrieved.
;; @returns (ok uint) The balance of the token for the given principal.
(define-read-only (get-balance (owner principal))
  (ok (ft-get-balance quiz-token owner))
)

;; @desc Mint new quiz tokens and send them to a recipient.
;; @param amount (uint) The amount of tokens to mint.
;; @param recipient (principal) The principal to receive the minted tokens.
;; @returns (response bool uint) Ok if successful, Err otherwise.
;; @error u100 If the minting fails.
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (>= amount u0) err-u100) ;; Ensure amount is non-negative
    (ft-mint? quiz-token amount recipient)
  )
)

;; @desc Transfer quiz tokens from the sender to a recipient.
;; @param amount (uint) The amount of tokens to transfer.
;; @param sender (principal) The principal sending the tokens.
;; @param recipient (principal) The principal receiving the tokens.
;; @returns (response bool uint) Ok if successful, Err otherwise.
;; @error u101 If the transfer fails.
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-u101) ;; Only sender can initiate transfer
    (ft-transfer? quiz-token amount sender recipient)
  )
)

;; Error codes
(define-constant err-u100 (err u100)) ;; Minting failed
(define-constant err-u101 (err u101)) ;; Transfer failed
