import "./style.css";

interface IButtonProps {
  classname?: string,
  type?: "button" | "submit" | "reset" | undefined,
  id?: string,
  onClick?: (e: any) => void;
  children?: any;
}

export default function Button(props: IButtonProps) {
  const {
    classname,
    type,
    id,
    onClick,
    children
  } = props;

  return (
    <button type={type} className={classname} onClick={onClick} id={id}>
      {children}
    </button>
  );
}
