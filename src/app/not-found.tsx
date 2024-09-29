'use client'

import Link from 'next/link'
import { ArrowFatLeft } from 'phosphor-react'

import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <section className={styles.notfound}>
      <div className={styles.notfoundInfo}>
        <h2>Ops!</h2>
        <h1>Página não encontrada</h1>
        <Link href={'/'}>
          <ArrowFatLeft size={44} color="#ff0000" weight="fill" />
          Voltar para Home
        </Link>

        <div className={styles.wrapper}>
          {/* <div className="t" style={{ '--i': 1 }}></div> */}

          <div className={styles.t} style={{ ['--i' as string]: 11 }} />
          <div className={styles.t} style={{ ['--i' as string]: 12 }} />
          <div className={styles.t} style={{ ['--i' as string]: 13 }} />
          <div className={styles.t} style={{ ['--i' as string]: 14 }} />
          <div className={styles.t} style={{ ['--i' as string]: 15 }} />
          <div className={styles.t} style={{ ['--i' as string]: 16 }} />
          <div className={styles.t} style={{ ['--i' as string]: 17 }} />
          <div className={styles.t} style={{ ['--i' as string]: 18 }} />
          <div className={styles.t} style={{ ['--i' as string]: 19 }} />
          <div className={styles.t} style={{ ['--i' as string]: 20 }} />
        </div>
      </div>
    </section>
  )
}
