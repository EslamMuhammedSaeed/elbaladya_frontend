import { useState, useRef } from "react";
import styles from "./TextInput.module.scss";

type TextInputProps = {
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInput({
  name,
  value = "",
  placeholder = "",
  onChange,
}: TextInputProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={styles.inputWrapper}
      ref={containerRef}
      onClick={() => setOpen(!open)}
    >
      <input
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
