import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest"; // Import from vitest
import { useStateWithHistory } from "../index";

describe("useStateWithHistory", () => {
  it("should initialize with the correct value", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));
    expect(result.current[0]).toBe(0);
  });

  it("should update value and store history", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));

    act(() => {
      result.current[1](1);
    });

    expect(result.current[0]).toBe(1);
    expect(result.current[2].history).toEqual([0, 1]);
  });

  it("should navigate back in history", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[2].back();
    });

    expect(result.current[0]).toBe(1);
    expect(result.current[2].pointer).toBe(1);
  });

  it("should navigate forward in history", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[2].back();
      result.current[2].forward();
    });

    expect(result.current[0]).toBe(2);
    expect(result.current[2].pointer).toBe(2);
  });

  it("should go to specific history index", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[1](3);
      result.current[2].go(1);
    });

    expect(result.current[0]).toBe(1);
    expect(result.current[2].pointer).toBe(1);
  });

  it("should work with objects", () => {
    const { result } = renderHook(() =>
      useStateWithHistory<{ name: string; age: number }>({
        name: "John",
        age: 20,
      })
    );

    act(() => {
      result.current[1]({ name: "Jane", age: 25 });
      result.current[1]({ name: "Bob", age: 30 });
    });

    expect(result.current[0]).toEqual({ name: "Bob", age: 30 });
    expect(result.current[2].history).toEqual([
      { name: "John", age: 20 },
      { name: "Jane", age: 25 },
      { name: "Bob", age: 30 },
    ]);
  });

  it("should work with arrays", () => {
    const { result } = renderHook(() =>
      useStateWithHistory<string[]>(["initial"])
    );

    act(() => {
      result.current[1](["initial", "second"]);
      result.current[1](["initial", "second", "third"]);
    });

    expect(result.current[0]).toEqual(["initial", "second", "third"]);
    expect(result.current[2].history).toEqual([
      ["initial"],
      ["initial", "second"],
      ["initial", "second", "third"],
    ]);
  });

  it("should handle function updates with complex types", () => {
    const { result } = renderHook(() =>
      useStateWithHistory<string[]>(["initial"])
    );

    act(() => {
      result.current[1]((prev) => [...prev, "second"]);
      result.current[1]((prev) => [...prev, "third"]);
    });

    expect(result.current[0]).toEqual(["initial", "second", "third"]);
    expect(result.current[2].history).toEqual([
      ["initial"],
      ["initial", "second"],
      ["initial", "second", "third"],
    ]);
  });

  it("should navigate to the first state", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[2].go(1); // Go to middle
      result.current[2].first(); // Go to first
    });

    expect(result.current[0]).toBe(0);
    expect(result.current[2].pointer).toBe(0);
  });

  it("should navigate to the last state", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[2].back(); // Go back once
      result.current[2].last(); // Go to last
    });

    expect(result.current[0]).toBe(2);
    expect(result.current[2].pointer).toBe(2);
  });

  it("should not change state if already at first/last", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
    });

    // Already at last
    act(() => {
      result.current[2].last();
    });
    expect(result.current[0]).toBe(2);
    expect(result.current[2].pointer).toBe(2);

    // Go to first
    act(() => {
      result.current[2].first();
    });
    expect(result.current[0]).toBe(0);
    expect(result.current[2].pointer).toBe(0);

    // Already at first
    act(() => {
      result.current[2].first();
    });
    expect(result.current[0]).toBe(0);
    expect(result.current[2].pointer).toBe(0);
  });

  it("should clear history", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[2].clear();
    });

    expect(result.current[0]).toBe(2); // Current state should remain
    expect(result.current[2].history).toEqual([2]);
    expect(result.current[2].pointer).toBe(0);
  });

  it("should trim start of history", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));

    act(() => {
      result.current[1](1);
      result.current[1](2); // pointer is 2, history is [0, 1, 2]
      result.current[1](3); // pointer is 3, history is [0, 1, 2, 3]
      result.current[2].back(); // pointer is 2, state is 2
      result.current[2].trimStart();
    });

    expect(result.current[0]).toBe(2);
    expect(result.current[2].history).toEqual([2, 3]);
    expect(result.current[2].pointer).toBe(0);
  });

  it("should trim end of history", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[1](3); // pointer is 3, history is [0, 1, 2, 3]
      result.current[2].go(1); // pointer is 1, state is 1
      result.current[2].trimEnd();
    });

    expect(result.current[0]).toBe(1);
    expect(result.current[2].history).toEqual([0, 1]);
    expect(result.current[2].pointer).toBe(1);
  });

  it("should not change state if no past/future to clear", () => {
    const { result } = renderHook(() => useStateWithHistory<number>(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
    });

    // No future to clear (already at last state)
    act(() => {
      result.current[2].trimEnd();
    });
    expect(result.current[0]).toBe(2);
    expect(result.current[2].history).toEqual([0, 1, 2]);
    expect(result.current[2].pointer).toBe(2);

    // Go to first state
    act(() => {
      result.current[2].first();
    });

    // No past to clear (already at first state)
    act(() => {
      result.current[2].trimStart();
    });
    expect(result.current[0]).toBe(0);
    expect(result.current[2].history).toEqual([0, 1, 2]);
    expect(result.current[2].pointer).toBe(0);
  });
});
