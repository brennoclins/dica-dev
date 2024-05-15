'use client'

import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import Markdown from 'react-markdown'

import { useGithub } from '@/hooks/useGithub'

import styles from './search-form.module.css'

type Issues = {
  number: number
  title: string
  body: string
  html_url: string
  updated_at: Date

  comments: number
  user: {
    login: string
    avatar_url: string
    html_url: string
  }
}

interface Post extends Array<Issues> {}

export function SearchForm() {
  const { issues } = useGithub()
  const [searchText, setSearchText] = useState<string>('')
  const [posts, setPosts] = useState<Post>(issues)

  function handleSearchPost(event: FormEvent) {
    event.preventDefault()

    const postsFilted = issues.filter((post) => post.body.includes(searchText))
    if (postsFilted.length === 0) {
      alert(`Termo não encontrado: ${searchText}`)
    } else {
      setPosts(postsFilted)
    }

    // console.log({
    //   'Issues': issues,
    //   'posts': posts,
    //   'postsFilter': postsFilted

    // });
  }

  useEffect(() => {
    if (posts.length === 0) setPosts(issues)
  }, [issues, posts])

  return (
    <section className={styles.searchForm}>
      <section className={styles.searchFormContainer}>
        <form onSubmit={handleSearchPost}>
          <div className={styles.searchFormHeader}>
            <h2 className={styles.searchFormTitle}>Publicações</h2>
            <span className={styles.searchFormSubTitle}>
              {`${posts.length} ${
                posts.length === 1 ? 'Publicação' : 'Publicações'
              }`}
            </span>
          </div>

          <input
            className={styles.searchFormInput}
            type="text"
            placeholder="Buscar conteúdo"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>
      </section>

      <section className={styles.postCardConainer}>
        {posts.map((post) => {
          const updatedAtDateFormatted = format(
            post.updated_at,
            "d 'de' LLLL 'ás' HH:mm'h'",
            { locale: ptBR },
          )
          const updatedAtDateRelativeToNow = formatDistanceToNow(
            post.updated_at,
            { locale: ptBR, addSuffix: true },
          )

          return (
            <div key={post.number} className={styles.postCard}>
              <div>
                <header className={styles.postCardHeader}>
                  <h4 className={styles.postCardTitle}>{post.title}</h4>
                  <span className={styles.postCardDate}>
                    <time title={updatedAtDateFormatted}>
                      {updatedAtDateRelativeToNow}
                    </time>
                  </span>
                </header>

                <Markdown className={styles.postCardText}>{post.body}</Markdown>
              </div>

              <footer>
                <Link
                  className={styles.postCardLink}
                  href={`/posts/${post.number}`}
                >
                  Click e leia mais...
                </Link>
              </footer>
            </div>
          )
        })}
      </section>
    </section>
  )
}
