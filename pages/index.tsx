import styles from '../styles/index.module.css';
import Link from 'next/link';

export default function Home() {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>WELCOME TO THE STREAMING</h1>
      <div className={styles.buttons} >
      <Link href="/guest">
        <button className={styles.button}>FILMS</button>
      </Link>
      <Link href="/guestv">
        <button className={styles.button}>SERIES</button>
      </Link>
      <Link href="/">
        <button className={styles.button}>LOGIN</button>
      </Link>

      </div>
    </div>
  )
}
