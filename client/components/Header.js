import Link from "next/link";
import { useRouter } from "next/router";

import style from "../styles/Header.module.scss";

const Header = ({ currentUser }) => {
  const router = useRouter();

  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkconfig) => linkconfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className={style.navbar__item}>
          <Link href={href}>
            <a
              className={
                router.asPath === href
                  ? style.navbar__active
                  : style.navbar__link
              }
            >
              {label}
            </a>
          </Link>
        </li>
      );
    });
  return (
    <nav className={style.navbar}>
      <Link href="/">
        <a className={style.navbar__brand}>GitTix</a>
      </Link>

      <div className={style.navbar__div}>
        <ul className={style.navbar__list}>{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
