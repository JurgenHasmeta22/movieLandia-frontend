import "./style.css";

interface ILabelProps {
  classname?: string,
  onClick?: (e: any) => void;
  children?: any;
}

export default function Label(props: ILabelProps) {
  const {
    classname,
    onClick,
    children
  } = props;

  return (
    <span className={classname ? classname : "default"} onClick={onClick ? onClick : () => {}}>
      {children}
    </span>
  );
}
