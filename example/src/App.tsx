import React from "react";
import { useStateWithHistory } from "../../src/index"; // Corrected import path
import "./App.css"; // Import the CSS

function App(): JSX.Element {
  const [
    count,
    setCount,
    { back, forward, first, last, history, pointer, clear, trimStart, trimEnd },
  ] = useStateWithHistory<number>(0);

  const isFirst = pointer === 0;
  const isLast = pointer === history.length - 1;

  return (
    <div className="container">
      <h1>useStateWithHistory Example</h1>

      <div className="state-info">
        <p>
          Current Count: <span>{count}</span>
        </p>
        <p>
          History Position: <span>{pointer + 1}</span> of{" "}
          <span>{history.length}</span>
        </p>
        <div className="history-display">
          Full History: [{history.join(", ")}]
        </div>
      </div>

      <div className="all-controls-container">
        <div className="controls-group">
          <h2>Controls</h2>
          <div className="controls">
            <button onClick={() => setCount((c) => c - 1)}>Decrease</button>
            <button onClick={() => setCount((c) => c + 1)}>Increase</button>
          </div>
        </div>

        <div className="controls-group">
          <h2>Navigation</h2>
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

        <div className="controls-group">
          <h2>Clear History</h2>
          <div className="clear-controls">
            <button onClick={clear}>Clear History</button>
            <button onClick={trimStart} disabled={isFirst}>
              Trim Start
            </button>
            <button onClick={trimEnd} disabled={isLast}>
              Trim End
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
