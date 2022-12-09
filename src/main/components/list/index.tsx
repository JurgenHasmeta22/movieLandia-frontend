import "./style.css";

interface IListProps {
  classname?: string,
  onClick?: (e: any) => void;
  children?: any;
}

export default function List(props: IListProps) {
  const {
    classname,
    onClick,
    children
  } = props;

  return (
    <ul className={classname} onClick={onClick}>
      {children}
    </ul>
  );
}
