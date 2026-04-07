import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.css";
import WhatsappWidget from "@/components/shared/whatsappWidget/WhatsappWidget";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Image src="/logo.png" alt="Virat Sports Industries" width={48} height={48} />
            <span className={styles.brandName}>VIRAT SPORTS<br />INDUSTRIES</span>
          </div>
          <p className={styles.tagline}>Complete Sports equipment</p>
          <p className={styles.about}>
            Your one-stop destination for all sports equipment and gear. Quality products for every sport.
          </p>
        </div>

        {/* Contact */}
        <div className={styles.contact}>
          <h4 className={styles.sectionTitle}>Contact us</h4>
          <a href="tel:9599244510" className={styles.phoneBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
            </svg>
            9599244510
          </a>

          <h4 className={styles.sectionTitle} style={{ marginTop: "1.5rem" }}>Visit Us</h4>
          <address className={styles.address}>
            RZ 1243 Gali No. 5/2<br />
            Main Sagarpur, New Delhi<br />
            Delhi – 110045
          </address>
        </div>

        {/* Map */}
        <div className={styles.mapWrap}>
          <iframe
            src="https://www.google.com/maps?q=RZ+1243+Gali+No+5/2+Main+Sagarpur+New+Delhi+110045&output=embed"
            width="100%"
            height="200"
            style={{ border: 0, borderRadius: "8px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <Link href="/terms" className={styles.link}>Terms &amp; Conditions</Link>
        <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
        <Link href="/shipping" className={styles.link}>Shipping &amp; Payment Policy</Link>
      </div>

      <WhatsappWidget />
    </footer>
  );
}
