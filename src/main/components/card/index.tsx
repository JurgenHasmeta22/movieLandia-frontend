import Container from "../container";
import "./style.css";

interface ICardProps {
  classname?: string,
  myKey?: number,
  onClick?: (e: any) => void;
  children?: any;
}

export default function Card(props: ICardProps) {
  const {
    classname,
    myKey,
    onClick,
    children
  } = props;

  return (
    <Container
      classname={classname}
      myKey={myKey}
      onClick={onClick}
    >
      {children}
    </Container>
  );
}
