"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase-browser";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/signin?redirect=/profile");
  }, [user, loading]);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name.trim(), phone: form.phone.trim() || null })
      .eq("id", user.id);

    setSaving(false);
    if (error) { setError("Failed to save profile. Please try again."); return; }
    await refreshProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) return <LoadingSkeleton />;
  if (!user) return null;

  const avatarChar = (profile?.full_name ?? user.email ?? "U")[0].toUpperCase();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>My Account</h1>

        <div className={styles.layout}>
          {/* ── Sidebar ── */}
          <aside className={styles.sidebar}>
            <div className={styles.avatarBox}>
              <div className={styles.avatar}>{avatarChar}</div>
              <p className={styles.avatarName}>{profile?.full_name ?? "User"}</p>
              <p className={styles.avatarEmail}>{user.email}</p>
              <span className={styles.roleBadge}>{profile?.role ?? "customer"}</span>
            </div>

            <nav className={styles.sideNav}>
              <a href="#profile" className={`${styles.sideLink} ${styles.sideLinkActive}`}>
                <UserIcon /> Profile
              </a>
              <a href="/orders" className={styles.sideLink}>
                <OrderIcon /> My Orders
              </a>
              <a href="/cart" className={styles.sideLink}>
                <CartIcon /> My Cart
              </a>
              <button className={styles.sideLinkDanger} onClick={handleSignOut}>
                <SignOutIcon /> Sign Out
              </button>
            </nav>
          </aside>

          {/* ── Main ── */}
          <div className={styles.main}>
            {/* Profile Form */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Full Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={form.full_name}
                      onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                      placeholder="Aapka poora naam"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      className={styles.input}
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    className={`${styles.input} ${styles.inputDisabled}`}
                    value={user.email ?? ""}
                    disabled
                  />
                  <span className={styles.fieldHint}>Email cannot be changed.</span>
                </div>

                {error && <p className={styles.errorMsg}>{error}</p>}
                {saved && <p className={styles.successMsg}><CheckIcon /> Profile saved successfully.</p>}

                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? <Spinner /> : "Save Changes"}
                </button>
              </form>
            </section>

            {/* Account Info */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Account Details</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoKey}>Account ID</span>
                  <span className={styles.infoVal}>{user.id.slice(0, 8)}...</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoKey}>Member Since</span>
                  <span className={styles.infoVal}>
                    {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoKey}>Email Status</span>
                  <span className={`${styles.infoVal} ${styles.verified}`}>
                    <CheckIcon /> Verified
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoKey}>Role</span>
                  <span className={styles.infoVal}>{profile?.role ?? "customer"}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    </main>
  );
}

function Spinner() { return <span style={{ display: "inline-block", width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />; }
function CheckIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>; }
function UserIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>; }
function OrderIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>; }
function CartIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>; }
function SignOutIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>; }
