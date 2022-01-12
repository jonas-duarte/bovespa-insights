import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Bovespa insights</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Play&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.hero}>
        <div className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/logo-opaque.svg" alt="logo" />
          <div className={styles.heroTitle}>
            Bovespa <br></br>insights
          </div>
        </div>
        <div className={styles.heroButtons}>
          <Link passHref href="/app">
            <button>OPEN APP</button>
          </Link>
          <Link passHref href="https://github.com/jonas-duarte/bovespa-insights">
            <button>GITHUB</button>
          </Link>
          <Link passHref href="https://www.linkedin.com/in/jonas-rafael-duarte-dos-santos-7b8803105/">
            <button>LINKEDIN</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
