import { useEffect, useState } from "react"

const clientID = 'uxj8hdpst8v4lutkr842b3lxz8tp0o'

interface User {
  id: string
  login: string
  display_name: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
}

export interface ChannelInfo {
  broadcaster_id: string
  broadcaster_language: string
  broadcaster_login: string
  broadcaster_name: string
  content_classification_labels: string[]
  delay: number
  game_id: string
  game_name: string
  is_branded_content: boolean
  tags: string[]
  title: string
}

interface StreamInfo {
  game_id: string
  game_name: string
  id?: string
  is_mature?: boolean
  language: string
  started_at?: string
  tags: string[]
  thumbnail_url?: string
  title: string
  type?: string
  user_id: string
  user_login: string
  user_name: string
  viewer_count?: number
}

export type ChannelSummary = StreamInfo & {
  profile_image_url: string
  broadcaster_type: string
  user_description: string
}

function getSiteUrl() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000'
  } else {
    return 'https://streamerview.onrender.com'
  }
}

function readToken() {
  return window.localStorage.getItem('token')
}

/**
 * Makes a call to the Twitch API.
 * @param {string} url The url to call
 * @param {string} token The API token
 * @returns The parsed JSON response.
 */
async function apiCall<T>(url: string) {
  const token = readToken()

  // TODO Set the Twitch API prefix in here
  const res = await fetch(`https://api.twitch.tv/helix/${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': clientID
    }
  })
  if (res.status >= 400) {
    throw {
      message: `Error during request to ${url}`,
      statusCode: res.status,
    }
  }
  return await res.json() as T
}

export function useTwitchAuth() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const initialToken = readToken()
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

export async function getChannelInfo(username: string): Promise<ChannelSummary | undefined> {
  const user = (await apiCall<{ data: User[] }>(`users?login=${username}`))?.data[0]
  if (user) {
    const [channelRes, streamRes] = await Promise.all([
      apiCall<{ data: ChannelInfo[] }>(`channels?broadcaster_id=${user.id}`),
      apiCall<{ data: StreamInfo[] }>(`streams?user_id=${user.id}`)
    ])

    const channel = channelRes?.data[0]
    const stream = streamRes?.data[0]

    if (channel) {
      if (stream) {
        return {
          ...stream,
          broadcaster_type: user.broadcaster_type,
          profile_image_url: user.profile_image_url,
          user_description: user.description,
        }
      } else {
        return {
          broadcaster_type: user.broadcaster_type,
          profile_image_url: user.profile_image_url,
          user_description: user.description,
          game_id: channel.game_id,
          game_name: channel.game_name,
          language: channel.broadcaster_language,
          tags: channel.tags,
          user_id: user.id,
          user_login: user.login,
          user_name: user.display_name,
          title: channel.title,
        }
      }
    }
  }
}
