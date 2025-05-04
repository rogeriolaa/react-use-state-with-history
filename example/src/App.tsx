import React from "react";
import { useStateWithHistory } from "../../src/index"; // Corrected import path
import './App.css'; // Import the CSS

function App(): JSX.Element {
  const [count, setCount, { back, forward, first, last, history, pointer }] =
    useStateWithHistory<number>(0);

  const isFirst = pointer === 0;
  const isLast = pointer === history.length - 1;

  return (
    <div className="container">
      <h1>useStateWithHistory Example</h1>

      <div className="state-info">
        <p>Current Count: <span>{count}</span></p>
        <p>
          History Position: <span>{pointer + 1}</span> of <span>{history.length}</span>
        </p>
        <div className="history-display">
          Full History: [{history.join(", ")}]
        </div>
      </div>

      <div className="controls">
        <button onClick={() => setCount((c) => c - 1)}>Decrease</button>
        <button onClick={() => setCount((c) => c + 1)}>Increase</button>
      </div>

      <div className="navigation">
         <button onClick={first} disabled={isFirst}>
          First
        </button>
        <button onClick={back} disabled={isFirst}>
          Back
        </button>
        <button onClick={forward} disabled={isLast}>
          Forward
        </button>
         <button onClick={last} disabled={isLast}>
          Last
        </button>
      </div>
    </div>
  );
}

export default App;
