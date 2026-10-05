import { useState } from "react";
import Quiz from "./components/Quiz";
import UploadBox from "./components/UploadBox";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState(null);

  function handleQuizGenerated(generatedQuestions) {
    setQuestions(generatedQuestions);
  }

  function handleStartOver() {
    setQuestions(null);
  }

  return (
    <main className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <div className="brand">
          <div className="brand-icon">✦</div>
          <span>Study Masters</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#upload">Create Quiz</a>
        </div>

        <a href="#upload" className="nav-button">
          Get Started →
        </a>

      </nav>


      {/* =========================
          HERO
      ========================= */}

      {!questions ? (
        <>
          <section className="hero">

            <div className="ai-badge">
              ✦ AI-POWERED LEARNING
            </div>

            <h1>
              Turn Your Notes Into
              <span> Smarter Practice.</span>
            </h1>

            <p className="hero-description">
              Upload your study material and let Study Masters
              create personalized quizzes to help you learn faster
              and remember more.
            </p>

          </section>


          {/* =========================
              UPLOAD
          ========================= */}

          <section id="upload" className="upload-section">

            <UploadBox
              onQuizGenerated={handleQuizGenerated}
            />

          </section>


          {/* =========================
              HOW IT WORKS
          ========================= */}

          <section id="how-it-works" className="steps-section">

            <div className="section-heading">
              <span>HOW IT WORKS</span>
              <h2>From study material to practice in seconds.</h2>
            </div>

            <div className="steps">

              <div className="step-card">

                <div className="step-number">
                  01
                </div>

                <div className="step-icon">
                  ↑
                </div>

                <h3>Upload</h3>

                <p>
                  Upload your lecture notes, textbook,
                  or study material as a PDF.
                </p>

              </div>


              <div className="step-card">

                <div className="step-number">
                  02
                </div>

                <div className="step-icon">
                  ✦
                </div>

                <h3>AI Quiz</h3>

                <p>
                  Study Masters analyzes your material
                  and creates personalized questions.
                </p>

              </div>


              <div className="step-card">

                <div className="step-number">
                  03
                </div>

                <div className="step-icon">
                  ✓
                </div>

                <h3>Practice</h3>

                <p>
                  Test yourself, see your score,
                  and identify what you need to improve.
                </p>

              </div>

            </div>

          </section>


          {/* =========================
              FEATURES
          ========================= */}

          <section id="features" className="features-section">

            <div className="feature-item">
              <span>✦</span>
              <div>
                <strong>AI Generated</strong>
                <p>Questions based on your actual material.</p>
              </div>
            </div>

            <div className="feature-item">
              <span>◈</span>
              <div>
                <strong>Custom Difficulty</strong>
                <p>Choose Easy, Medium, or Hard.</p>
              </div>
            </div>

            <div className="feature-item">
              <span>◎</span>
              <div>
                <strong>Instant Feedback</strong>
                <p>See explanations and your score immediately.</p>
              </div>
            </div>

          </section>

        </>
      ) : (

        /* =========================
           QUIZ
        ========================= */

        <section className="quiz-section">

          <div className="quiz-top">

            <button
              className="back-button"
              onClick={handleStartOver}
            >
              ← Create Another Quiz
            </button>

          </div>

          <Quiz questions={questions} />

        </section>

      )}


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">
        <span>✦ Study Masters</span>
        <p>Learn smarter. Practice better.</p>
      </footer>

    </main>
  );
}

export default App;