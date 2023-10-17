import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { RefCallBack } from "react-hook-form";
import { strict } from "yargs";

interface Attributes {
  placeholder: string;
  optionLabel?: string;
  disabled?: boolean;
  width: string;
  value: string;
  id: string;
  className: string | undefined;
  focusInputRef: RefCallBack;
  onChange: (...event: any[]) => void;
  options?: object[];
}

const styles = {
  height: "41px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  width: "",
};

export const DropDownComponent = (props: Attributes) => {
  const { width, placeholder, id, className, focusInputRef, value, onChange, disabled, options, optionLabel } = props;
  styles.width = width;
  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={options}
      optionLabel={optionLabel}
      disabled={disabled}
      style={styles}
      placeholder={placeholder}
      id={id}
      className={className}
      focusInputRef={focusInputRef}
      showClear
    />
  );
};
