import { NavLink } from "react-router-dom";
import "./NavRail.css";

const navItems = [
  { to: "/", label: "Home", end: true, icon: HomeIcon },
  { to: "/books", label: "Books", icon: BookIcon },
  { to: "/authors", label: "Authors", icon: AuthorIcon },
  { to: "/locations", label: "Locations", icon: LocationIcon },
];

export function NavRail() {
  return (
    <nav className="nav-rail" aria-label="Main navigation">
      <div className="nav-rail__brand" title="Home Library">
        <BookIcon />
      </div>
      <ul className="nav-rail__list">
        {navItems.map(({ to, label, icon: Icon, ...rest }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `nav-rail__link${isActive ? " nav-rail__link--active" : ""}`
              }
              {...rest}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 2 12h3v8h6v-5h2v5h6v-8h3L12 3Z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6Zm0 2h5v7l2.5-1.5L16 11V4h4v16H6V4Z" />
    </svg>
  );
}

function AuthorIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}
