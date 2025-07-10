import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

test("renders button and handles click", () => {
  const onClick = jest.fn();
  render(<Button onClick={onClick}>Click me</Button>);
  const btn = screen.getByText(/click me/i);
  fireEvent.click(btn);
  expect(onClick).toHaveBeenCalled();
}); 