import { useContext } from 'react'

import { GithubContext } from '@/context/GithubContext'

export function useGithub() {
  return useContext(GithubContext)
}
