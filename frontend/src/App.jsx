import Quiz from "./components/Quiz";
import UploadBox from "./components/UploadBox";
import "./App.css";

function App() {
  return (
    <main className="app">
      <section className="hero">
        <div className="icon">📚</div>

        <h1>Study Masters</h1>

        <p className="tagline">
          Turn your study material into personalized practice.
        </p>

        <UploadBox />

        <Quiz />
      </section>
    </main>
  );
}

export default App;