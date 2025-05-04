# React useState with History

[![npm version](https://badge.fury.io/js/%40n0n3br%2Freact-use-state-with-history.svg)](https://badge.fury.io/js/%40n0n3br%2Freact-use-state-with-history)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A custom React hook that enhances the standard `useState` hook by providing history tracking and navigation capabilities (undo/redo functionality).

## Features

- Drop-in replacement for `useState` for basic usage
- Keeps a history of state changes
- Provides functions to navigate back (`back`) and forward (`forward`) through the history
- Provides functions to jump directly to the first (`first`) and last (`last`) state in history
- Provides a function to jump to a specific index (`go`) in the history
- Exposes the complete history array and the current pointer position
- Works with any data type (numbers, strings, objects, arrays, etc.)
- Written in TypeScript for type safety

## Installation

```bash
npm install @n0n3br/react-use-state-with-history
# or
yarn add @n0n3br/react-use-state-with-history
# or
pnpm add @n0n3br/react-use-state-with-history
```

## Basic Usage

```tsx
import { useStateWithHistory } from "@n0n3br/react-use-state-with-history";

function Counter() {
  const [count, setCount, { back, forward }] = useStateWithHistory(0);

  return (
    <div>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={back}>Undo</button>
      <button onClick={forward}>Redo</button>
    </div>
  );
}
```

## Advanced Usage

```tsx
import { useStateWithHistory } from "@n0n3br/react-use-state-with-history";

function TextEditor() {
  const [text, setText, { history, pointer, back, forward, go, first, last }] =
    useStateWithHistory("");

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        cols={40}
      />

      <div>
        <button onClick={back} disabled={pointer <= 0}>
          Undo
        </button>
        <button onClick={forward} disabled={pointer >= history.length - 1}>
          Redo
        </button>
        <button onClick={first} disabled={pointer === 0}>
          First Version
        </button>
        <button onClick={last} disabled={pointer === history.length - 1}>
          Latest Version
        </button>
      </div>

      <div>
        <p>History States: {history.length}</p>
        <p>Current Position: {pointer}</p>

        {/* Display history entries */}
        <div>
          {history.map((item, index) => (
            <button
              key={index}
              onClick={() => go(index)}
              style={{
                fontWeight: index === pointer ? "bold" : "normal",
                margin: "2px",
              }}
            >
              {index}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## API Reference

### useStateWithHistory

```tsx
function useStateWithHistory<T>(initialValue: T): [
  T,
  (value: T | ((prevState: T) => T)) => void,
  {
    history: T[];
    pointer: number;
    back: () => void;
    forward: () => void;
    go: (index: number) => void;
    first: () => void;
    last: () => void;
  }
];
```

#### Parameters

- `initialValue: T` - The initial state value (can be any type)

#### Return Value

Returns a tuple with three elements:

1. **Current State** (`T`): The current state value
2. **State Setter** (`(value: T | ((prevState: T) => T)) => void`): Function to update the state
   - Accepts a new value or a function that receives the previous state and returns a new value
   - Each update adds a new entry to the history
3. **History Controls** (Object): An object containing:
   - `history: T[]` - Array of all state values in history
   - `pointer: number` - Current position in the history array
   - `back: () => void` - Move to the previous state in history
   - `forward: () => void` - Move to the next state in history
   - `go: (index: number) => void` - Jump to a specific index in history
   - `first: () => void` - Jump to the first state in history
   - `last: () => void` - Jump to the most recent state in history

## Working with Complex Types

The hook works seamlessly with complex data types like objects and arrays:

```tsx
import { useStateWithHistory } from "@n0n3br/react-use-state-with-history";

function UserForm() {
  const [user, setUser, { back, forward }] = useStateWithHistory({
    name: "",
    email: "",
    age: 0,
  });

  const updateField = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  return (
    <div>
      <div>
        <label>Name:</label>
        <input
          value={user.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          value={user.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
      </div>

      <div>
        <label>Age:</label>
        <input
          type="number"
          value={user.age}
          onChange={(e) => updateField("age", parseInt(e.target.value) || 0)}
        />
      </div>

      <button onClick={back}>Undo</button>
      <button onClick={forward}>Redo</button>
    </div>
  );
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Publishing

To publish this package to npm under the @n0n3br scope:

```bash
# Login to npm (if not already logged in)
npm login

# Build the package
npm run build

# Publish to npm
npm publish
```

Note: The package is configured with `"access": "public"` in package.json, which allows the scoped package to be publicly accessible.
