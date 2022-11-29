import "./style.css";

interface ILabelProps {
  classname?: string,
  onClick?: (e: any) => void,
  myKey?: number,
  children?: any
}

export default function Label(props: ILabelProps) {
  const {
    classname,
    onClick,
    myKey,
    children
  } = props;

  return (
    <span className={classname} onClick={onClick} key={myKey}>
      {children}
    </span>
  );
}
