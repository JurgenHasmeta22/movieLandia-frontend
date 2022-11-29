import "./style.css";

interface IParagraphProps {
  classname?: string,
  children?: any;
  id?: string;
}

export default function Paragraph(props: IParagraphProps) {
  const {
    classname,
    children,
    id
  } = props;

  return (
    <p className={classname} id={id}>
      {children}
    </p>
  );
}
