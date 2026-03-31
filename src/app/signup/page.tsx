"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "../signin/auth.module.css";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) { setError("Apna naam enter karein."); return; }
    if (!form.email) { setError("Email zaruri hai."); return; }
    if (form.password.length < 6) { setError("Password kam se kam 6 characters ka hona chahiye."); return; }
    if (form.password !== form.confirm) { setError("Passwords match nahi kar rahe."); return; }

    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.fullName);
    setLoading(false);

    if (error) {
      if (error.includes("already registered")) {
        setError("Ye email already registered hai. Sign in karein.");
      } else {
        setError(error);
      }
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successBox}>
            <div className={styles.successIcon}><CheckIcon /></div>
            <h2 className={styles.successTitle}>Account Ban Gaya!</h2>
            <p className={styles.successText}>
              Aapke email <strong>{form.email}</strong> par ek confirmation link bheja gaya hai.
              Link click karke apna account verify karein, phir sign in karein.
            </p>
            <Link href="/signin" className={styles.submitBtn} style={{ textDecoration: "none", textAlign: "center" }}>
              Sign In Page Par Jayein
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.logoMark}>VS</div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Virat Sports par join karein</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Aapka poora naam"
              value={form.fullName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Kam se kam 6 characters"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Password dobara enter karein"
              value={form.confirm}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          {error && <p className={styles.errorMsg}><ErrorIcon />{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Spinner /> : "Create Account"}
          </button>
        </form>

        <p className={styles.switchText}>
          Pehle se account hai?{" "}
          <Link href="/signin" className={styles.switchLink}>Sign In</Link>
        </p>
      </div>
    </main>
  );
}

function Spinner() {
  return <span className={styles.spinner} />;
}

function ErrorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
