import "./style.css";

interface ICardProps {
  classname: string,
  key: number,
  onClick?: (e: any) => void;
  children?: any;
}

export default function Card(props: ICardProps) {
  const {
    classname,
    key,
    onClick,
    children
  } = props;

  return (
    <div
      className={classname}
      key={key}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
