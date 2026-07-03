// ================================================
// ✅ Component: Counter
// File: components/counter/Counter.tsx
// Description: Redux slice demo UI for increment/decrement with styled inputs and buttons
// ================================================

import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from "./counterSlice";
import { CardRoot, Input, Actions } from "../../theme/appStyles";
import { CounterValue, Row } from "./styled/counter";

export function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState("2");

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <CardRoot>
      <Row>
        <button
          className="button"
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <CounterValue>{count}</CounterValue>
        <button
          className="button"
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </Row>
      <Row>
        <Input
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <Actions>
          <button onClick={() => dispatch(incrementByAmount(incrementValue))}>
            Add Amount
          </button>
          <button onClick={() => dispatch(incrementAsync(incrementValue))}>
            Add Async
          </button>
          <button onClick={() => dispatch(incrementIfOdd(incrementValue))}>
            Add If Odd
          </button>
        </Actions>
      </Row>
    </CardRoot>
  );
}
