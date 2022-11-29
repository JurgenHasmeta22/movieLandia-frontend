import "./style.css";

interface IHeadingProps {
  classname?: string,
  key?: number,
  onClick?: (e: any) => void;
  children?: any;
  type?: string;
}

export default function Heading(props: IHeadingProps) {
  const {
    classname,
    key,
    onClick,
    type,
    children
  } = props;

  return (
    <h2
      className={classname}
      key={key}
      onClick={onClick}
    >
      {children}
    </h2>
  );
}
