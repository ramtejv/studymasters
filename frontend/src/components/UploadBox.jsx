import { useState } from "react";

function UploadBox({ onQuizGenerated }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      setFile(null);
      return;
    }

    setError("");
    setResult("");
    setFile(selectedFile);
  }

  async function handleGenerateQuiz() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();

      formData.append("pdf", file);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      // Send the AI-generated quiz to App.jsx
      if (data.quiz && data.quiz.questions) {
        onQuizGenerated(data.quiz.questions);

        setResult(
          `Quiz generated successfully! ${data.quiz.questions.length} questions created.`
        );
      } else {
        throw new Error("No quiz questions were returned.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-box">
      <h2>Upload your study material</h2>

      <p>
        Upload a PDF and let Study Masters create questions from it.
      </p>

      <input
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        disabled={loading}
      />

      {file && (
        <p>
          Selected file: <strong>{file.name}</strong>
        </p>
      )}

      {error && <p>{error}</p>}

      {loading && (
        <p>
          Processing PDF and generating quiz...
        </p>
      )}

      {result && <p>{result}</p>}

      <button
        onClick={handleGenerateQuiz}
        disabled={!file || loading}
      >
        {loading ? "Generating Quiz..." : "Generate Quiz"}
      </button>
    </div>
  );
}

export default UploadBox;