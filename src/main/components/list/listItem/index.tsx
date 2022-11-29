import "./style.css";

interface IListItemProps {
  classname?: string,
  onClick?: (e: any) => void;
  children?: any;
}

export default function ListItem(props: IListItemProps) {
  const {
    classname,
    onClick,
    children
  } = props;

  return (
    <li className={classname} onClick={onClick}>
      {children}
    </li>
  );
}
