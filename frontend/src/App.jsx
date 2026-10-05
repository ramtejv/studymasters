import { useState } from "react";
import Quiz from "./components/Quiz";
import UploadBox from "./components/UploadBox";
import "./App.css";

function App() {
  const [quizQuestions, setQuizQuestions] = useState([]);

  function handleQuizGenerated(questions) {
    setQuizQuestions(questions);
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="icon">📚</div>

        <h1>Study Masters</h1>

        <p className="tagline">
          Turn your study material into personalized practice.
        </p>

        <UploadBox onQuizGenerated={handleQuizGenerated} />

        {quizQuestions.length > 0 && (
          <Quiz questions={quizQuestions} />
        )}
      </section>
    </main>
  );
}

export default App;