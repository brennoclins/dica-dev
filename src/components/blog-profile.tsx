import {
  ArrowSquareOut,
  Buildings,
  GithubLogo,
  Users,
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'

import type { GithubUser } from '@/lib/github'

import styles from './blog-profile.module.css'

type BlogProfileProps = {
  user: GithubUser
}

export function BlogProfile({ user }: BlogProfileProps) {
  return (
    <section className={styles.profile}>
      <div className={styles.profileAvatar}>
        {user.avatar_url && (
          <Image
            src={user.avatar_url}
            alt={`Foto de perfil de ${user.name ?? user.login}`}
            width={256}
            height={256}
            priority
            className="h-auto w-full"
          />
        )}
      </div>

      <div className={styles.profileContent}>
        <section className={styles.profileTitle}>
          <h1>{user.name ?? user.login}</h1>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir perfil no GitHub"
          >
            GITHUB
            <ArrowSquareOut size={18} />
          </a>
        </section>

        {user.bio && (
          <section className={styles.profileDescription}>
            <p>{user.bio}</p>
          </section>
        )}

        <section className={styles.profileTags}>
          <span>
            <GithubLogo size={26} /> {user.login}
          </span>
          {user.company && (
            <span>
              <Buildings size={26} /> {user.company}
            </span>
          )}
          <span>
            <Users size={26} /> {user.followers} seguidores
          </span>
        </section>
      </div>
    </section>
  )
}
