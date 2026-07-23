import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";

export default function Loader({ size = "40" }) {
  return <Spiral size={size} speed="0.9" color="black" />;
}
