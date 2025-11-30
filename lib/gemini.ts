import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function createStore() {
    try {
        const fileSearchStore = await ai.fileSearchStores.create({
            config: { displayName: "rag-file-store" },
        });
        return { success: true, storeName: fileSearchStore.name };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function uploadFileToGemini(file: File) {
    try {
        // Create a new store for each upload (or you could pass an existing storeName if you wanted to append)
        // For this simple flow, we'll create a new one each time to give the user a fresh ID.
        const storeResult = await createStore();
        if (!storeResult.success || !storeResult.storeName) {
            return { success: false, error: storeResult.error || "Failed to create file store" };
        }

        const operation = await ai.fileSearchStores.uploadToFileSearchStore({
            file: file as unknown as Blob,
            fileSearchStoreName: "fileSearchStores/ragfilestore-tw7ieckhbt3j",
            config: {
                displayName: file.name,
            },
        });

        // Wait until import is complete
        let currentOperation = operation;
        while (!currentOperation.done) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            currentOperation = await ai.operations.get({ operation: currentOperation });
        }

        return { success: true, message: "File uploaded successfully", storeName: storeResult.storeName };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function generateAnswer(question: string) {
    try {
       

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: question,
            config: {
                tools: [
                    {
                        fileSearch: {
                            fileSearchStoreNames: ["fileSearchStores/ragfilestore-tw7ieckhbt3j"],
                        },
                    },
                ],
            },
        });

        return { success: true, answer: response.text };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}
