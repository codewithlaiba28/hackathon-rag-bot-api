"use client";

import { useState } from "react";

export default function Page() {
  const [question, setQuestion] = useState("");
  const [storeId, setStoreId] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !storeId.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `${question}` }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(`Error: ${data.error}`);
      }
    } catch (error) {
      setAnswer("Error: Failed to fetch answer");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">RAG Chat Interface</h1>

      <div className="space-y-8">
        {/* Question Section */}
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
          <form onSubmit={handleAskQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store ID</label>
              <input
                type="text"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                placeholder="Enter the Store ID from the upload page..."
                className="w-full p-3 border rounded-lg"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about your uploaded file..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={!question.trim() || !storeId.trim() || loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Ask
            </button>
          </form>

          {answer && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-black">
              <h3 className="font-semibold mb-2">Answer:</h3>
              <p className="whitespace-pre-wrap">{answer}</p>
            </div>
          )}

          {loading && <p className="mt-4 text-gray-600">Processing...</p>}
        </div>

        <div className="text-center">
          <a href="/upload" className="text-blue-600 hover:underline">Go to Upload Page</a>
        </div>
      </div>
    </div>
  );
}
