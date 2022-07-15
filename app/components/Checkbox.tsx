import styles from "./Checkbox.css";
import { InputHTMLAttributes } from "react";

export const links = () => [{ rel: "stylesheet", href: styles }];

interface CheckboxProps {
  checked?: boolean;
  dashed?: boolean;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
}
export function Checkbox(props: CheckboxProps) {
  return (
    <label className="c-custom-checkbox">
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
      />
      <svg
        width="32"
        height="32"
        viewBox="-4 -4 39 39"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          className="cb-bg"
          width="35"
          height="35"
          x="-2"
          y="-2"
          stroke="currentColor"
          fill="none"
          strokeWidth="3"
          strokeDasharray={props.dashed ? "6" : undefined}
          rx="6"
          ry="6"
        ></rect>
        <polyline
          className="cb-cm"
          points="4,14 12,23 28,5"
          stroke="transparent"
          strokeWidth="4"
          fill="none"
        ></polyline>
      </svg>
    </label>
  );
}
