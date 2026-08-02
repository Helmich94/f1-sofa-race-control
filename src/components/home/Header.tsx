import { signOut } from "firebase/auth";

import logo from "../branding/logo.svg";
import { auth } from "../../firebase/config";

export default function Header() {
  return (
    <header className="home-header">
      <img
        src={logo}
        alt="F1 Sofa Race Control"
        className="home-header-logo"
      />

      <button
        className="home-header-logout"
        type="button"
        onClick={() => signOut(auth)}
      >
        Uitloggen
      </button>
    </header>
  );
}