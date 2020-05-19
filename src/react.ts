import React, { useEffect, useState, FC } from "react";
import PWD from "./";

const listeners = [];

const useInited = () => {
  const [isInited, setInited] = useState(false);
  listeners.push(setInited);

  const setter = (val) => {
    listeners.forEach((l) => l(val));
  };
  return [isInited, setter];
};

interface ReactPWDProps {
  name: string;
  pwd: PWD;
}

export const ReactPWD: FC<ReactPWDProps> = (props) => {
  const { pwd, name } = props;
  const [hasStarted, setHasStarted] = useState(false);

  const elID = "pwd-term" + name;
  const [isInited, setInited] = useInited();

  useEffect(() => {
    if (!hasStarted && pwd && isInited === 2) {
      pwd.terminal({ selector: "#pwd-term2" });
      setHasStarted(true);
    }
    if (!hasStarted && pwd && isInited === false) {
      setInited(1);
      pwd.newSession([{ selector: "#" + elID }], null, () => {
        setInited(2);
      });
      setHasStarted(true);
    }
  }, [isInited, pwd]);

  return React.createElement("div", {
    id: elID,
    ...props,
  });
};

export default ReactPWD;
