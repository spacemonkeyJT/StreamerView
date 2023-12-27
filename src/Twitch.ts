import { useEffect, useState } from "react"

const clientID = 'uxj8hdpst8v4lutkr842b3lxz8tp0o'

function getSiteUrl() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000'
  } else {
    return 'https://streamerview.onrender.com'
  }
}

export function useTwitchAuth() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const initialToken = window.localStorage.getItem('token')
    if (initialToken) {
      setToken(initialToken)
    } else {
      const match = /access_token=([^&]+)/.exec(window.location.hash)
      if (match) {
        window.location.hash = ''
        window.localStorage.setItem('token', match[1])
        setToken(match[1])
      } else {
        window.location.href = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${clientID}&redirect_uri=${getSiteUrl()}&scope=`
      }
    }
  }, [])

  return !!token
}
