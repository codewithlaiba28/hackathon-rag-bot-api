"use client";

import { useState } from "react";
import { uploadFile } from "../actions";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    const [storeId, setStoreId] = useState("");

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setUploadStatus("Uploading...");
        setStoreId("");
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadFile(formData);
        if (result.success) {
            setUploadStatus("File uploaded successfully!");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setStoreId((result as any).storeName || "");
            setFile(null);
        } else {
            setUploadStatus(`Error: ${result.error}`);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Upload Documents for RAG</h1>

            <div className="border p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Upload File</h2>
                <form onSubmit={handleFileUpload} className="space-y-4">
                    <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!file || loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Upload
                    </button>

                    {uploadStatus && (
                        <p className={`text-sm ${uploadStatus.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                            {uploadStatus}
                        </p>
                    )}

                    {storeId && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="font-semibold text-green-800">Store ID Created:</p>
                            <div className="flex items-center gap-2 mt-2">
                                <code className="bg-white px-2 py-1 rounded border text-sm flex-1">{storeId}</code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(storeId)}
                                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                    type="button"
                                >
                                    Copy
                                </button>
                            </div>
                            <p className="text-xs text-green-700 mt-2">
                                Save this ID! You will need it to chat with this document.
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
