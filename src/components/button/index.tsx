import "./style.css";

interface IButtonProps {
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  id?: string;
  onClick?: (e: any) => void;
  children?: any;
}

export default function Button(props: IButtonProps) {
  const { className, type, id, onClick, children } = props;

  return (
    <button type={type} className={className} onClick={onClick} id={id}>
      {children}
    </button>
  );
}
