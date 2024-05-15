// import { BlogProfile } from '@/components/blog-profile'
import { SearchForm } from '@/components/search-form'

import styles from './home.module.css'

export default function Home() {
  return (
    <main className={styles.home}>
      <div className={styles.homeOverLayer} />
      <section className={styles.homeContainer}>
        <h1 className="text-white text-5xl m-12 text-center">Dica Dev</h1>
        <SearchForm />

        {/* <BlogProfile /> */}
      </section>
    </main>
  )
}
