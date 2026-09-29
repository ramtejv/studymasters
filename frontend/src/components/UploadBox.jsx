import { useState } from 'react'

function UploadBox() {
  const [file, setFile] = useState(null)

  function handleFileChange(event) {
    const selectedFile = event.target.files[0]

    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  return (
    <div className="upload-box">
      <div className="upload-icon">📄</div>

      <h2>Upload your study material</h2>

      <p>Upload a PDF and let Study Masters create questions from it.</p>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
      />

      {file && (
        <p>
          Selected file: <strong>{file.name}</strong>
        </p>
      )}
    </div>
  )
}

export default UploadBox