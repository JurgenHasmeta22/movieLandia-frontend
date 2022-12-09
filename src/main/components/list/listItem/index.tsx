import "./style.css";

interface IListItemProps {
  classname?: string,
  myKey?: number,
  onClick?: (e: any) => void;
  children?: any;
}

export default function ListItem(props: IListItemProps) {
  const {
    classname,
    onClick,
    myKey,
    children
  } = props;

  return (
    <li className={classname} onClick={onClick} key={myKey}>
      {children}
    </li>
  );
}
