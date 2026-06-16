import { Outlet } from "react-router-dom";
import { NavRail } from "./NavRail";
import "./AppLayout.css";

export function AppLayout() {
  return (
    <div className="app-layout">
      <NavRail />
      <div className="app-layout__content">
        <Outlet />
      </div>
    </div>
  );
}
