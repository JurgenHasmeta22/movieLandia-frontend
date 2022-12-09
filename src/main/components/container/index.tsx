import "./style.css";

interface IContainerProps {
  classname?: string,
  id?: string,
  myKey?: number,
  onClick?: (e: any) => void;
  children?: any;
}

export default function Container(props: IContainerProps) {
  const {
    classname,
    id,
    myKey,
    onClick,
    children
  } = props;

  return (
    <div className={classname} onClick={onClick} id={id} key={myKey}>
      {children}
    </div>
  );
}
