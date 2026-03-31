"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import styles from "./navbar.module.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    router.push("/");
  };

  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "User";
  const avatarChar = displayName[0].toUpperCase();

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
                autoFocus={isSearchOpen}
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
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* Auth — loading state mein kuch na dikhao */}
          {!loading && (
            <>
              {user ? (
                <div className={styles.profileWrapper}>
                  <button className={styles.profileBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <div className={styles.avatarPlaceholder}>{avatarChar}</div>
                    <span className={styles.profileName}>{displayName.split(" ")[0]}</span>
                    <ChevronIcon open={isMenuOpen} />
                  </button>

                  {/* Dropdown */}
                  {isMenuOpen && (
                    <>
                      <div className={styles.profileDropdown}>
                        <div className={styles.dropdownHeader}>
                          <p className={styles.dropdownName}>{displayName}</p>
                          <p className={styles.dropdownEmail}>{user.email}</p>
                        </div>
                        <div className={styles.dropdownDivider} />
                        <Link href="/profile" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                          <UserIcon /> My Profile
                        </Link>
                        <Link href="/orders" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                          <OrderIcon /> My Orders
                        </Link>
                        <Link href="/cart" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                          <CartIcon /> My Cart {totalItems > 0 && <span className={styles.dropdownBadge}>{totalItems}</span>}
                        </Link>
                        <div className={styles.dropdownDivider} />
                        <button className={styles.dropdownSignOut} onClick={handleSignOut}>
                          <SignOutIcon /> Sign Out
                        </button>
                      </div>
                      <div className={styles.dropdownOverlay} onClick={() => setIsMenuOpen(false)} />
                    </>
                  )}
                </div>
              ) : (
                <Link href="/signin" className={styles.signinBtn}>
                  Sign In
                </Link>
              )}
            </>
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
              <Link href={link.href} className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
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
          {user ? (
            <div className={styles.mobileUserRow}>
              <div className={styles.mobileUserInfo}>
                <div className={styles.avatarPlaceholder}>{avatarChar}</div>
                <div>
                  <p className={styles.mobileUserName}>{displayName}</p>
                  <p className={styles.mobileUserEmail}>{user.email}</p>
                </div>
              </div>
              <div className={styles.mobileUserLinks}>
                <Link href="/profile" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                <Link href="/orders" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                <button className={styles.mobileSignOutBtn} onClick={handleSignOut}>Sign Out</button>
              </div>
            </div>
          ) : (
            <div className={styles.mobileAuthBtns}>
              <Link href="/signin" className={styles.mobileSigninBtn} onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className={styles.mobileSignupBtn} onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}

          <div className={styles.mobileMeta}>
            <Link href="/cart" className={styles.mobileCartLink} onClick={() => setIsMenuOpen(false)}>
              <CartIcon />
              <span>Cart ({totalItems})</span>
            </Link>
            <button className={styles.mobileThemeToggle} onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMenuOpen && !document.querySelector(`.${styles.profileDropdown}`) && (
        <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
}

/* ── Icons ── */
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
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
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
