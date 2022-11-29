import "./style.css";

interface IContainerProps {
  classname?: string,
  id?: string,
  onClick?: (e: any) => void;
  children?: any;
}

export default function Container(props: IContainerProps) {
  const {
    classname,
    id,
    onClick,
    children
  } = props;

  return (
    <div className={classname} onClick={onClick} id={id}>
      {children}
    </div>
  );
}
