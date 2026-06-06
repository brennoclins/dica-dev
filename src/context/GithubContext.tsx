'use client'
/* eslint-disable camelcase */

import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { api } from '@/lib/axios'

//  -== SETTING_CONFIG ==-  ||
const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USER || 'brennoclins'
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || 'dica-dev'
// --------------------------\\

type User = {
  id: number
  login: string
  name: string
  bio: string | null
  company: string | null
  avatar_url: string
  email: string | null
  followers: number
  following: number
  html_url: string
}

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

interface GithubContextData {
  user: User
  issues: Issues[]
  isLoading: boolean
  error: Error | null
}

export const GithubContext = createContext<GithubContextData>(
  {} as GithubContextData
)

interface GithubContextProviderData {
  children: ReactNode
}

export function GithubContextProvider({ children }: GithubContextProviderData) {
  const [user, setUser] = useState<User>({} as User)
  const [issues, setIssues] = useState<Issues[]>([] as Issues[])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const getUser = useCallback(async (username: string) => {
    const response = await api.get<User>(`users/${username}`)

    const {
      id,
      login,
      name,
      bio,
      company,
      avatar_url,
      email,
      followers,
      following,
      html_url,
    } = response.data

    setUser({
      id,
      login,
      name,
      bio,
      company,
      avatar_url,
      email,
      followers,
      following,
      html_url,
    })
  }, [])

  const getPosts = useCallback(
    async (username: string, repository: string, query: string) => {
      let page = 1
      let allIssues: Issues[] = []
      let hasMoreIssues = true

      while (hasMoreIssues) {
        const response = await api.get(
          `search/issues?q=${query}%20repo:${username}/${repository}&page=${page}&per_page=30`
        )

        const issues = response.data.items
        allIssues = [...allIssues, ...issues]

        if (issues.length < 30) {
          hasMoreIssues = false
        } else {
          page++
        }
      }

      setIssues(allIssues)
    },
    []
  )

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      setIsLoading(true)
      setError(null)
      try {
        await Promise.all([
          getUser(GITHUB_USER),
          getPosts(GITHUB_USER, GITHUB_REPO, ''),
        ])
      } catch (err) {
        if (!cancelled) {
          const normalized = err instanceof Error ? err : new Error(String(err))
          console.error('[GithubContext] failed to load data:', normalized)
          setError(normalized)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [getUser, getPosts])

  return (
    <GithubContext.Provider value={{ user, issues, isLoading, error }}>
      {children}
    </GithubContext.Provider>
  )
}
