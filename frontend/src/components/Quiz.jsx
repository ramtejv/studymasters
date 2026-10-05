import { useState } from "react";

function Quiz({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  function handleAnswer(index) {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    if (index === questions[currentQuestion].answer) {
      setScore((previousScore) => previousScore + 1);
    }
  }

  function handleNext() {
    if (selectedAnswer === null) {
      return;
    }

    if (currentQuestion === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setSelectedAnswer(null);
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  }

  if (!questions || questions.length === 0) {
    return null;
  }

  if (finished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <div className="quiz-box score-screen">

        <div className="score-icon">
          ✦
        </div>

        <div className="section-label">
          QUIZ COMPLETE
        </div>

        <h2>Great work.</h2>

        <p className="score-message">
          {percentage >= 80
            ? "Excellent work! You've got this."
            : percentage >= 60
            ? "Good job! Keep practicing."
            : "Keep studying and give it another shot."}
        </p>

        <div
          className="score-circle"
          style={{
            "--progress": `${percentage}%`,
          }}
        >
          <span>{percentage}%</span>
        </div>

        <h3>
          {score} / {questions.length}
        </h3>

        <p className="score-breakdown">
          Correct answers
        </p>

        <div className="score-actions">
          <button onClick={restartQuiz}>
            Try Again
          </button>
        </div>

      </div>
    );
  }

  const question = questions[currentQuestion];

  const isCorrect =
    selectedAnswer !== null &&
    selectedAnswer === question.answer;

  return (
    <div className="quiz-box">

      {/* TOP */}

      <div className="quiz-header">

        <div>
          <div className="section-label">
            STUDY MASTERS QUIZ
          </div>

          <h2>
            Question {currentQuestion + 1}
          </h2>
        </div>

        <div className="question-counter">
          {currentQuestion + 1}
          <span> / {questions.length}</span>
        </div>

      </div>

      {/* PROGRESS */}

      <div className="quiz-progress">
        <div
          className="quiz-progress-bar"
          style={{
            width: `${
              ((currentQuestion + 1) /
                questions.length) *
              100
            }%`,
          }}
        />
      </div>

      {/* QUESTION */}

      <div className="question-area">

        <p className="question-number">
          QUESTION {String(currentQuestion + 1).padStart(2, "0")}
        </p>

        <h3>
          {question.question}
        </h3>

      </div>

      {/* OPTIONS */}

      <div className="quiz-options">

        {question.options.map((option, index) => {

          let className = "quiz-option";

          if (selectedAnswer !== null) {

            if (index === question.answer) {
              className += " correct";
            } else if (index === selectedAnswer) {
              className += " incorrect";
            }

          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >

              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>

              <span className="option-text">
                {option}
              </span>

              {selectedAnswer !== null &&
                index === question.answer && (
                  <span className="option-result">
                    ✓
                  </span>
                )}

              {selectedAnswer !== null &&
                index === selectedAnswer &&
                index !== question.answer && (
                  <span className="option-result">
                    ×
                  </span>
                )}

            </button>
          );
        })}

      </div>

      {/* FEEDBACK */}

      {selectedAnswer !== null && (
        <div
          className={`answer-feedback ${
            isCorrect ? "feedback-correct" : "feedback-incorrect"
          }`}
        >

          <div className="feedback-title">
            {isCorrect
              ? "Correct answer"
              : "Not quite"}
          </div>

          {!isCorrect && (
            <p>
              <strong>
                Correct answer:
              </strong>{" "}
              {question.options[question.answer]}
            </p>
          )}

          {question.explanation && (
            <p>
              {question.explanation}
            </p>
          )}

        </div>
      )}

      {/* NEXT */}

      <button
        className="next-button"
        onClick={handleNext}
        disabled={selectedAnswer === null}
      >
        {currentQuestion === questions.length - 1
          ? "Finish Quiz →"
          : "Next Question →"}
      </button>

    </div>
  );
}

export default Quiz;