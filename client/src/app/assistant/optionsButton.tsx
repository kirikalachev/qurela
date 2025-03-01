import React from "react";
import Image from "next/image";
import Options from "@/app/three-dots.svg";

const OptionsButton = React.memo(() => {
  return <Image src={Options} alt="Опции" />;
});

export default OptionsButton;
