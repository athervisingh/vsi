"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./auth.module.css";

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") ?? "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email aur password dono zaruri hain.");
      return;
    }
    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    setLoading(false);
    if (error) {
      setError("Email ya password galat hai.");
      return;
    }
    router.push(redirect);
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={styles.logoMark}>VSI</div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your Virat Sports account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="password">Password</label>
              <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          {error && <p className={styles.errorMsg}><ErrorIcon />{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Spinner /> : "Sign In"}
          </button>
        </form>

        <p className={styles.switchText}>
          Don’t have an account?{" "}
          <Link href="/signup" className={styles.switchLink}>Sign Up</Link>
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
