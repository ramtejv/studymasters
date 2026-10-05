import { useState } from "react";

function UploadBox({ onQuizGenerated }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("Medium");

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
      formData.append("questionCount", questionCount);
      formData.append("difficulty", difficulty);

      const response = await fetch("https://studymasters.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

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
        Upload a PDF and let Study Masters create a personalized quiz.
      </p>

      {/* PDF UPLOAD AREA */}

      <label className="file-upload-area">
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          disabled={loading}
        />

        <div className="upload-icon">
          ↑
        </div>

        <div className="upload-title">
          {file ? "PDF selected" : "Drop your PDF here"}
        </div>

        <div className="upload-subtitle">
          {file
            ? "Click here to choose a different file"
            : "or click to browse your files"}
        </div>

        <div className="upload-hint">
          PDF files · Maximum 10 MB
        </div>
      </label>

      {/* SELECTED FILE */}

      {file && (
        <div className="selected-file">
          <div className="file-icon">
            📄
          </div>

          <div className="file-info">
            <strong>{file.name}</strong>

            <span>
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>

          <div className="file-check">
            ✓
          </div>
        </div>
      )}

      {/* QUIZ SETTINGS */}

      <div className="quiz-settings">

        <div className="setting">
          <label htmlFor="question-count">
            Number of questions
          </label>

          <select
            id="question-count"
            value={questionCount}
            onChange={(event) =>
              setQuestionCount(Number(event.target.value))
            }
            disabled={loading}
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
          </select>
        </div>

        <div className="setting">
          <label htmlFor="difficulty">
            Difficulty
          </label>

          <select
            id="difficulty"
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value)
            }
            disabled={loading}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

      </div>

      {/* ERROR */}

      {error && (
        <p className="upload-error">
          {error}
        </p>
      )}

      {/* LOADING */}

      {loading && (
        <p className="upload-loading">
          Processing PDF and generating your{" "}
          {difficulty.toLowerCase()} quiz...
        </p>
      )}

      {/* SUCCESS */}

      {result && (
        <p className="upload-success">
          {result}
        </p>
      )}

      {/* GENERATE BUTTON */}

      <button
        onClick={handleGenerateQuiz}
        disabled={!file || loading}
      >
        {loading
          ? "Generating Quiz..."
          : "Generate Quiz →"}
      </button>

    </div>
  );
}

export default UploadBox;