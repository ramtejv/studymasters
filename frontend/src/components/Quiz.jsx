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
        <div className="score-icon">📚</div>

        <h2>Quiz Complete!</h2>

        <p className="score-message">
          {percentage >= 80
            ? "Excellent work! 🎉"
            : percentage >= 60
            ? "Good job! Keep practicing. 💪"
            : "Keep studying and give it another shot. 💪"}
        </p>

        <div
          className="score-circle"
          style={{
            "--score": `${percentage}%`,
          }}
        >
          <div className="score-circle-inner">
            <span>{percentage}%</span>
          </div>
        </div>

        <h3>
          {score} / {questions.length}
        </h3>

        <p className="score-breakdown">
          {score} correct out of {questions.length} questions
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

  const percentage = Math.round(
    ((currentQuestion + 1) / questions.length) * 100
  );

  return (
    <div className="quiz-box">
      <h2>Study Masters Quiz</h2>

      <div className="quiz-progress">
        <span>
          Question {currentQuestion + 1} of {questions.length}
        </span>

        <span>{percentage}%</span>
      </div>

      <h3>{question.question}</h3>

      <div className="quiz-options">
        {question.options.map((option, index) => {
          let className = "";

          if (selectedAnswer !== null) {
            if (index === question.answer) {
              className = "correct";
            } else if (index === selectedAnswer) {
              className = "incorrect";
            }
          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <div className="answer-feedback">
          <h3>
            {isCorrect ? "Correct! ✅" : "Incorrect ❌"}
          </h3>

          {!isCorrect && (
            <p>
              <strong>Correct answer:</strong>{" "}
              {question.options[question.answer]}
            </p>
          )}

          {question.explanation && (
            <p>
              <strong>Explanation:</strong>{" "}
              {question.explanation}
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={selectedAnswer === null}
      >
        {currentQuestion === questions.length - 1
          ? "Finish Quiz"
          : "Next Question"}
      </button>
    </div>
  );
}

export default Quiz;