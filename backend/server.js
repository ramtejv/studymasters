require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { CanvasFactory } = require("pdf-parse/worker");
const { PDFParse } = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 5000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.get("/", (req, res) => {
  res.json({
    message: "Study Masters backend is running!",
  });
});

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    // 1. Check PDF
    if (!req.file) {
      return res.status(400).json({
        error: "No PDF file uploaded.",
      });
    }

    console.log(`Received PDF: ${req.file.originalname}`);

    // 2. Extract text from PDF
    const parser = new PDFParse({
      data: req.file.buffer,
      CanvasFactory,
    });

    const result = await parser.getText();

    await parser.destroy();

    const extractedText = result.text || "";

    console.log(`Extracted ${extractedText.length} characters`);

    if (!extractedText.trim()) {
      return res.status(400).json({
        error: "Could not extract any text from this PDF.",
      });
    }

    // 3. Ask Gemini to create quiz
    let response = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(
          `Sending request to Gemini (attempt ${attempt}/3)...`
        );

        response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",

          contents: `
You are Study Masters, an educational quiz generator.

Read the study material below and create exactly 5 multiple-choice questions.

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use code fences.
Do NOT add explanations outside the JSON.

Use exactly this format:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": 0,
      "explanation": "Short explanation of the correct answer"
    }
  ]
}

Rules:

- Create exactly 5 questions.
- Every question must have exactly 4 options.
- "answer" must be 0, 1, 2, or 3.
- 0 means the first option is correct.
- 1 means the second option is correct.
- 2 means the third option is correct.
- 3 means the fourth option is correct.
- Questions must be based ONLY on the uploaded study material.
- Make the questions useful for a college student.
- Avoid duplicate questions.
- Include a short explanation for every answer.

Study material:

${extractedText}
          `,
        });

        console.log("Gemini response received.");

        break;
      } catch (error) {
        console.log(`Gemini attempt ${attempt} failed.`);
        console.log(error.message);

        if (attempt === 3) {
          throw error;
        }

        const waitTime = attempt * 2000;

        console.log(
          `Waiting ${waitTime / 1000} seconds before retrying...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, waitTime)
        );
      }
    }

    // 4. Get Gemini response
    let aiText = "";

    if (response && response.text) {
      aiText = response.text;
    }

    // Backup method
    if (!aiText && response?.candidates?.[0]?.content?.parts) {
      aiText = response.candidates[0].content.parts
        .filter((part) => part.text)
        .map((part) => part.text)
        .join("\n");
    }

    console.log(`AI response length: ${aiText.length}`);

    if (!aiText) {
      console.log("Gemini returned no usable text.");

      return res.status(500).json({
        error: "Gemini returned an empty response.",
      });
    }

    console.log("Raw Gemini response:");
    console.log(aiText);

    // 5. Remove accidental markdown
    aiText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 6. Convert Gemini response into JavaScript object
    let quiz;

    try {
      quiz = JSON.parse(aiText);
    } catch (parseError) {
      console.error("Gemini returned invalid JSON.");
      console.error(aiText);

      return res.status(500).json({
        error: "Gemini returned an invalid quiz format.",
      });
    }

    // 7. Validate quiz
    if (!quiz.questions || !Array.isArray(quiz.questions)) {
      return res.status(500).json({
        error: "Gemini did not return valid questions.",
      });
    }

    console.log(
      `Generated ${quiz.questions.length} questions.`
    );

    // 8. Send quiz to frontend
    res.json({
      success: true,
      message: "Quiz generated successfully!",
      filename: req.file.originalname,
      extractedCharacters: extractedText.length,
      quiz: quiz,
    });

  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      success: false,
      error: "Something went wrong while processing the PDF.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Backend running on http://localhost:${PORT}`
  );
});