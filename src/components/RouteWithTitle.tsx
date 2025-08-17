import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

type RouteWithTitleProps = {
  element: React.ReactElement;
  title: string;
  icon?: React.ReactNode;
};

const RouteWithTitle = ({ element, title, icon }: RouteWithTitleProps) => {
  const setTitle =
    useOutletContext<(title: string, icon?: React.ReactNode) => void>();

  useEffect(() => {
    setTitle(title, icon);
  }, [title, icon, setTitle]);

  return element;
};

export default RouteWithTitle;
