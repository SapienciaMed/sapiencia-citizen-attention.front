import React, { SyntheticEvent } from "react";
import { FaSpinner } from "react-icons/fa";

interface ILabelProps {
  value: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  action?: Function;
  id?: string;
  form?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function ButtonComponent({
  value,
  type = "submit",
  className = "button-main",
  action = () => {},
  id,
  form,
  disabled,
  loading,
}: ILabelProps): React.JSX.Element {
  const handleButtonClick = (event: SyntheticEvent) => {
    if (type !== "submit") event.preventDefault();
    action();
  };

  return (
    <button type={type} id={id} form={form} className={className} onClick={handleButtonClick} disabled={disabled}>
      <div className="app5-container-button-text">
        {loading && (
          <span>
            <FaSpinner />{" "}
          </span>
        )}

        {value}
      </div>
    </button>
  );
}
