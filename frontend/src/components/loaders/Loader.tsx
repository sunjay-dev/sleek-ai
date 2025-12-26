import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";

export default function Loader() {
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <Spiral size="40" speed="0.9" color="black" />
    </div>
  );
}
