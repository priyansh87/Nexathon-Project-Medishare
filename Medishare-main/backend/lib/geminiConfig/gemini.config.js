import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const readFileAsBase64 = (filePath) => {
  return fs.readFileSync(filePath, { encoding: "base64" });
};

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File deleted: ${filePath}`);
    }
  } catch (err) {
    console.error("Error deleting file:", err);
  }
};

export const analyzePdfWithGemini = async (filePath) => {
  try {
    const base64Data = readFileAsBase64(filePath);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Analyze the provided medical report and return structured results in **pure JSON format** (without markdown or code blocks). The response should follow this structure strictly:
{
  "patientInfo": {
    "name": "Full Name",
    "age": 0,
    "gender": "Male/Female/Other"
  },
  "diagnoses": [
    {
      "condition": "Condition Name",
      "medication": {
        "name": "Medicine Name",
        "dosage": "Dosage Information"
      }
    }
  ],
  "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}`;

    const results = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: "application/pdf",
              },
            },
          ],
        },
      ],
    });

    let responseText = results.response.text();

    // **🔧 Fix: Extract clean JSON**
    const cleanedJson = responseText.replace(/```json\n?|```/g, "").trim();

    const parsedData = JSON.parse(cleanedJson);

    // ✅ Delete the file after extracting the result
    deleteFile(filePath);

    return parsedData;
  } catch (error) {
    console.error("Error analyzing PDF with Gemini:", error);

    // ✅ Ensure file is deleted even if Gemini fails
    deleteFile(filePath);

    throw new Error("Gemini analysis failed.");
  }
};
