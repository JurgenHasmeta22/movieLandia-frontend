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
    <Label classname={classname} onClick={onClick}>
      {children}
    </Label>
  );
}
