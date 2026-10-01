import { useState } from "react";

function UploadBox() {
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

      setResult(data.analysis || "No analysis was returned.");
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

      {error && (
        <p>
          {error}
        </p>
      )}

      {loading && (
        <p>
          Processing PDF and generating study analysis...
        </p>
      )}

      {result && (
        <div>
          <h2>Study Analysis</h2>

          <p>PDF processed successfully!</p>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              textAlign: "left",
              maxWidth: "800px",
              margin: "20px auto",
            }}
          >
            {result}
          </pre>
        </div>
      )}

      <button
        onClick={handleGenerateQuiz}
        disabled={!file || loading}
      >
        {loading ? "Processing..." : "Generate Quiz"}
      </button>
    </div>
  );
}

export default UploadBox;