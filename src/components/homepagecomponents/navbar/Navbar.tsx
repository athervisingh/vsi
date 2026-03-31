"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import styles from "./navbar.module.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();

  // TODO: Replace with actual auth state from your auth system
  const isSignedIn = false;
  const user = { name: "John Doe" };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search:", searchQuery);
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>

        {/* Logo & Brand */}
        <Link href="/" className={styles.brand}>
          <div className={styles.logoBox}>
            <span className={styles.logoText}>
              <Image src="/logo.png" alt="Virat Sports Industries" width={50} height={50} />
            </span>
          </div>
          <div className={styles.brandName}>
            <span className={styles.brandMain}>Virat Sports</span>
            <span className={styles.brandSub}>Industries</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className={styles.navActions}>

          {/* Search */}
          <div className={`${styles.searchWrapper} ${isSearchOpen ? styles.searchOpen : ""}`}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchSubmitBtn} aria-label="Search">
                <SearchIcon />
              </button>
            </form>
            <button
              className={styles.searchToggleBtn}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
            >
              <SearchIcon />
            </button>
          </div>

          {/* Cart */}
          <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
            <CartIcon />
            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
          </Link>

          {/* Theme Toggle */}
          <button
            className={styles.themeToggleBtn}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* Sign In / Profile */}
          {isSignedIn ? (
            <Link href="/profile" className={styles.profileBtn}>
              <div className={styles.avatarPlaceholder}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className={styles.profileName}>{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link href="/signin" className={styles.signinBtn}>
              Sign In
            </Link>
          )}

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen1 : ""}`} />
            <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen2 : ""}`} />
            <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen3 : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <ul className={styles.mobileNavLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.mobileDivider} />

        <form onSubmit={handleSearchSubmit} className={styles.mobileSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.mobileSearchInput}
          />
          <button type="submit" className={styles.mobileSearchBtn}>
            <SearchIcon />
          </button>
        </form>

        <div className={styles.mobileDivider} />

        <div className={styles.mobileAuthSection}>
          {isSignedIn ? (
            <Link href="/profile" className={styles.mobileProfileLink} onClick={() => setIsMenuOpen(false)}>
              <div className={styles.avatarPlaceholder}>{user.name.charAt(0).toUpperCase()}</div>
              <span>{user.name}</span>
            </Link>
          ) : (
            <Link href="/signin" className={styles.mobileSigninBtn} onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Link>
          )}
          <Link href="/cart" className={styles.mobileCartLink} onClick={() => setIsMenuOpen(false)}>
            <CartIcon />
            <span>Cart ({totalItems})</span>
          </Link>
          <button className={styles.mobileThemeToggle} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
