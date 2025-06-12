"use client";

import { useEffect, useState } from "react";
import { useConnect } from "@stacks/connect-react";
import {
  fetchCallReadOnlyFunction, // Corrected import
  cvToJSON,
  uintCV,
  stringAsciiCV,
  listCV,
  standardPrincipalCV,
  PostConditionMode,
} from "@stacks/transactions";
// Removed Network import as it's causing issues
import { openContractCall } from "@stacks/connect"; // Keep this for now, assuming it will resolve
import {
  CONTRACT_ADDRESS,
  QUIZ_CONTRACT_NAME,
  NETWORK_URL,
} from "@/config";
import { userSession } from "@/lib/userSession";

interface Question {
  id: number;
  question: string;
  options: string[];
}

export default function Quiz() {
  // Removed openContractCall from useConnect destructuring
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionId, setQuestionId] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Removed network instantiation, will use "testnet" string directly

  useEffect(() => {
    fetchTotalQuestions();
  }, []);

  useEffect(() => {
    if (totalQuestions > 0) {
      fetchQuestion(questionId);
    }
  }, [questionId, totalQuestions]);

  const fetchTotalQuestions = async () => {
    try {
      setLoading(true);
      const result = await fetchCallReadOnlyFunction({ // Use fetchCallReadOnlyFunction
        contractAddress: CONTRACT_ADDRESS,
        contractName: QUIZ_CONTRACT_NAME,
        functionName: "get-total-questions",
        functionArgs: [],
        senderAddress: CONTRACT_ADDRESS, // Can be any address for read-only
        network: "testnet", // Use "testnet" string
      });
      const total = cvToJSON(result).value;
      setTotalQuestions(Number(total));
    } catch (error) {
      console.error("Error fetching total questions:", error);
      setMessage("Error fetching total questions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestion = async (id: number) => {
    try {
      setLoading(true);
      setMessage("");
      setSelectedAnswerIndex(null);
      const result = await fetchCallReadOnlyFunction({ // Use fetchCallReadOnlyFunction
        contractAddress: CONTRACT_ADDRESS,
        contractName: QUIZ_CONTRACT_NAME,
        functionName: "get-question",
        functionArgs: [uintCV(id)],
        senderAddress: CONTRACT_ADDRESS, // Can be any address for read-only
        network: "testnet", // Use "testnet" string
      });

      const questionData = cvToJSON(result).value;
      if (questionData) {
        setCurrentQuestion({
          id: id,
          question: questionData.question.value,
          options: questionData.options.value.map((opt: any) => opt.value),
        });
      } else {
        setCurrentQuestion(null);
        setMessage("Question not found.");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      setMessage("Error fetching question.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswerIndex === null || !currentQuestion) {
      setMessage("Please select an answer.");
      return;
    }

    if (!userSession.isUserSignedIn()) {
      setMessage("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    setMessage("Submitting answer...");

    try {
      await openContractCall({ // Use directly imported openContractCall
        contractAddress: CONTRACT_ADDRESS,
        contractName: QUIZ_CONTRACT_NAME,
        functionName: "submit-answer",
        functionArgs: [
          uintCV(currentQuestion.id),
          uintCV(selectedAnswerIndex),
        ],
        network: "testnet", // Use "testnet" string
        appDetails: {
          name: "Blockchain Quiz App",
          icon: "https://example.com/logo.png",
        },
        onFinish: (data: any) => { // Explicitly type data
          console.log("Transaction finished:", data);
          setMessage("Answer submitted! Checking result...");
          // In a real app, you'd poll the transaction status
          setLoading(false);
          // For now, just move to the next question
          setTimeout(() => {
            setMessage("");
            setQuestionId((prevId) => (prevId + 1) % totalQuestions);
          }, 3000);
        },
        onCancel: () => {
          setMessage("Transaction cancelled.");
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      setMessage("Error submitting answer.");
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setQuestionId((prevId) => (prevId + 1) % totalQuestions);
  };

  const handlePreviousQuestion = () => {
    setQuestionId((prevId) => (prevId - 1 + totalQuestions) % totalQuestions);
  };

  if (loading && !currentQuestion) {
    return <div className="text-center text-gray-600">Loading quiz...</div>;
  }

  if (totalQuestions === 0) {
    return <div className="text-center text-gray-600">No questions available. Please add questions via contract owner.</div>;
  }

  if (!currentQuestion) {
    return <div className="text-center text-gray-600">Question not found or an error occurred.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Question {currentQuestion.id + 1} / {totalQuestions}</h2>
      <p className="text-lg mb-6">{currentQuestion.question}</p>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`w-full text-left p-3 border rounded-md transition-colors duration-200
              ${selectedAnswerIndex === index ? "bg-blue-500 text-white" : "bg-gray-50 hover:bg-gray-200"}`}
            onClick={() => setSelectedAnswerIndex(index)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={questionId === 0}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleSubmitAnswer}
          disabled={selectedAnswerIndex === null || loading}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Answer"}
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={questionId === totalQuestions - 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {message && (
        <p className="mt-4 text-center text-red-500">{message}</p>
      )}
    </div>
  );
}
