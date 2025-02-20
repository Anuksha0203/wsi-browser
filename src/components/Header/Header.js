"use client";

import React from "react";
import Link from "next/link";

import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link className={styles.title} href="/home">WSI Browser</Link>

      {/* Desktop Navigation */}
      <div className={styles.actions}>
        <nav className={styles.navigation}>
          <Link href="/home">Home</Link>
          <Link href="/wsicatalogue">WSI Catalogue</Link>
          <Link href="/annotate">Annotate</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </div>
    </header>
  );
};
export default Header;
