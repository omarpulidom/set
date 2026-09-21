import type { Href } from 'expo-router'

interface IRedirectError {
  redirectTo: Href
  message?: string
}

export class RedirectError extends Error implements IRedirectError {
  redirectTo: Href

  constructor(redirectTo: Href, message?: string) {
    super(message)
    this.redirectTo = redirectTo
  }
}
