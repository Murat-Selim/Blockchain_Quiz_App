;; quiz-contract.clar
;; This contract manages the quiz questions, user answers, and token rewards.

;; Imports
(use-trait ft-token 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.sip-010-trait-ft-standard.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender) ;; The deployer of the contract is the owner
(define-constant REWARD_AMOUNT u10) ;; Amount of quiz tokens rewarded for a correct answer

;; Error codes
(define-constant err-unauthorized (err u100))
(define-constant err-question-not-found (err u101))
(define-constant err-invalid-answer (err u102))
(define-constant err-token-mint-failed (err u103))

;; Data map for questions
;; question-id (uint) -> { question (string-ascii 256), options (list 4 (string-ascii 64)), correct-answer-index (uint) }
(define-map questions uint {
    question: (string-ascii 256),
    options: (list 4 (string-ascii 64)),
    correct-answer-index: uint
})

;; Next question ID
(define-data-var next-question-id uint u0)

;; @desc Add a new quiz question. Only callable by the contract owner.
;; @param question-text (string-ascii 256) The text of the question.
;; @param options-list (list 4 (string-ascii 64)) A list of 4 possible answers.
;; @param correct-index (uint) The index (0-3) of the correct answer in the options list.
;; @returns (response uint uint) Ok with the new question ID if successful, Err otherwise.
;; @error u100 If the caller is not the contract owner.
;; @error u102 If the correct-index is out of bounds (0-3).
(define-public (add-question (question-text (string-ascii 256)) (options-list (list 4 (string-ascii 64))) (correct-index uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-unauthorized)
    (asserts! (< correct-index u4) err-invalid-answer) ;; Ensure correct-index is within bounds (0-3)

    (let ((q-id (var-get next-question-id)))
      (map-set questions q-id {
          question: question-text,
          options: options-list,
          correct-answer-index: correct-index
      })
      (var-set next-question-id (+ q-id u1))
      (ok q-id)
    )
  )
)

;; @desc Get a quiz question by its ID.
;; @param question-id (uint) The ID of the question.
;; @returns (response (optional { question (string-ascii 256), options (list 4 (string-ascii 64)), correct-answer-index (uint) }) uint)
;;          Ok with the question data if found, Err otherwise.
;; @error u101 If the question is not found.
(define-read-only (get-question (question-id uint))
  (ok (map-get? questions question-id))
)

;; @desc Get the total number of questions.
;; @returns (uint) The total number of questions.
(define-read-only (get-total-questions)
  (ok (var-get next-question-id))
)

;; @desc Submit an answer to a quiz question and receive tokens if correct.
;; @param question-id (uint) The ID of the question being answered.
;; @param submitted-answer-index (uint) The index (0-3) of the user's submitted answer.
;; @returns (response bool uint) Ok true if correct, Ok false if incorrect, Err otherwise.
;; @error u101 If the question is not found.
;; @error u102 If the submitted-answer-index is out of bounds (0-3).
;; @error u103 If token minting fails.
(define-public (submit-answer (question-id uint) (submitted-answer-index uint))
  (let ((question-data (map-get? questions question-id)))
    (asserts! (is-some question-data) err-question-not-found)
    (asserts! (< submitted-answer-index u4) err-invalid-answer) ;; Ensure submitted-answer-index is within bounds (0-3)

    (let ((q (unwrap! question-data err-question-not-found)))
      (if (is-eq (get correct-answer-index q) submitted-answer-index)
        (begin
          ;; Mint tokens to the sender
          (try! (contract-call? .quiz-token quiz-token mint REWARD_AMOUNT tx-sender))
          (ok true) ;; Correct answer
        )
        (ok false) ;; Incorrect answer
      )
    )
  )
)
