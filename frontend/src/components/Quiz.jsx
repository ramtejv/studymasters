import { useState } from "react";

function Quiz() {
  const questions = [
    {
      question: "What is IoT in healthcare?",
      options: [
        "Internet of Things used to monitor and manage healthcare data",
        "A hospital billing system",
        "A type of medical surgery",
        "A programming language",
      ],
      answer: 0,
    },
    {
      question: "Which sensor can measure blood oxygen saturation?",
      options: [
        "ECG sensor",
        "SpO₂ sensor",
        "Temperature sensor",
        "Blood pressure sensor",
      ],
      answer: 1,
    },
    {
      question: "What does ECG measure?",
      options: [
        "Blood glucose",
        "Body temperature",
        "Electrical activity of the heart",
        "Oxygen level",
      ],
      answer: 2,
    },
    {
      question: "Which technology allows healthcare devices to communicate wirelessly?",
      options: [
        "Bluetooth",
        "Keyboard",
        "Monitor",
        "Printer",
      ],
      answer: 0,
    },
    {
      question: "What is a major benefit of remote patient monitoring?",
      options: [
        "It eliminates all doctors",
        "It allows continuous monitoring of patients",
        "It prevents all diseases",
        "It replaces hospitals completely",
      ],
      answer: 1,
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  function handleAnswer(index) {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    if (index === questions[currentQuestion].answer) {
      setScore((previousScore) => previousScore + 1);
    }
  }

  function handleNext() {
    if (selectedAnswer === null) return;

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

  if (finished) {
    return (
      <div className="quiz-box">
        <h2>Quiz Complete!</h2>

        <p>
          Your score: <strong>{score} / {questions.length}</strong>
        </p>

        <button onClick={restartQuiz}>
          Try Again
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-box">
      <h2>Study Masters Quiz</h2>

      <p>
        Question {currentQuestion + 1} of {questions.length}
      </p>

      <h3>{question.question}</h3>

      <div>
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>

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