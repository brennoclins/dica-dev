'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowFatLeft } from '@phosphor-icons/react/dist/ssr'

import styles from './not-found.module.css'

const TILE_COUNT = 10
const TILE_INDEX_OFFSET = 11

export default function NotFound() {
  return (
    <section className={styles.notfound}>
      <div className={styles.notfoundInfo}>
        <h2>Ops!</h2>
        <h1>Página não encontrada</h1>
        <Link href="/">
          <ArrowFatLeft size={44} color="#ff0000" weight="fill" />
          Voltar para Home
        </Link>

        <div className={styles.wrapper}>
          {Array.from({ length: TILE_COUNT }, (_, idx) => {
            const i = idx + TILE_INDEX_OFFSET
            return (
              <div
                key={i}
                className={styles.t}
                style={{ '--i': i } as CSSProperties}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
