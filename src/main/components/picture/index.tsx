import "./style.css";

interface IPictureProps {
  classname?: string,
  onClick?: (e: any) => void;
  alt?: string;
  src?: string;
  id?: string;
}

export default function Picture(props: IPictureProps) {
  const {
    classname,
    onClick,
    alt,
    src,
    id
  } = props;

  return (
    <img className={classname} onClick={onClick} src={src} alt={alt} id={id} />
  );
}
