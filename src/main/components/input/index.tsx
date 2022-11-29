import "./style.css";

interface IInputProps {
  placeholder?: string,
  type?: string,
  id?: string,
  onChange?: (e: any) => void;
  required?: boolean;
  name?: string;
  ariaLabel?: string;
}

export default function Input(props: IInputProps) {
  const {
    placeholder,
    type,
    id,
    onChange,
    required,
    name,
    ariaLabel
  } = props;

  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      name={name}
      aria-label={ariaLabel}
    />
  );
}
