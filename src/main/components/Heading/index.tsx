import "./style.css";

interface IHeadingProps {
  classname?: string,
  onClick?: (e: any) => void;
  children?: any;
  type?: string;
}

export default function Heading(props: IHeadingProps) {
  const {
    classname,
    onClick,
    type,
    children
  } = props;

  return (
    <h2
      className={classname}
      onClick={onClick}
    >
      {children}
    </h2>
  );
}
