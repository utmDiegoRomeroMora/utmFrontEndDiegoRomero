import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import InferencePage from "../pages/inference/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/inferencia",
    element: <InferencePage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;