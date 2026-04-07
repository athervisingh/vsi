"use client";

import { useState } from "react";
import styles from "./whatsappWidget.module.css";

const WA_NUMBER = "919217661807";
const DEFAULT_MESSAGE = "Hi, I'm at your online store and need some help";

export default function WhatsappWidget() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  function handleStart() {
    const text = encodeURIComponent(message);
    const url = phone
      ? `https://wa.me/${WA_NUMBER}?text=${text}`
      : `https://wa.me/${WA_NUMBER}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      {/* Floating button */}
      <button
        className={styles.fab}
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat on WhatsApp"
      >
        <WhatsappIcon size={28} />
      </button>

      {/* Popup */}
      {open && (
        <div className={styles.popup}>
          <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">
            ×
          </button>
          <div className={styles.header}>
            <WhatsappIcon size={36} />
            <h3 className={styles.heading}>Chat with us on WhatsApp</h3>
          </div>
          <input
            className={styles.input}
            type="tel"
            placeholder="Enter your number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            className={styles.textarea}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className={styles.startBtn} onClick={handleStart}>
            Start a chat
          </button>
        </div>
      )}
    </>
  );
}

function WhatsappIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path
        d="M22.5 19.9c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.45s1.05 2.84 1.2 3.04c.15.2 2.07 3.16 5.01 4.43.7.3 1.25.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"
        fill="#fff"
      />
    </svg>
  );
}
