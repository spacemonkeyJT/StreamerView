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
  channel_url: string
  offline_image_url: string
  viewers_desc?: string;
  content_classification_labels: string[]
  category_url: string
  uptime_desc?: string
}

function getSiteUrl() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000'
  } else {
    return 'https://streamerview.onrender.com'
  }
}

function getViewersDesc(viewers: number) {
  if (viewers < 1000) {
    return `${viewers} viewers`
  }
  if (viewers < 10000) {
    return `${Math.round(viewers / 100) / 10}K viewers`
  }
  return `${Math.round(viewers / 1000)}K viewers`
}

function getElapsedDesc(since: string) {
  const startedTimestamp = new Date(since).valueOf()
  const totalSec = Math.trunc((Date.now() - startedTimestamp) / 1000)
  const seconds = totalSec % 60
  const remain = (totalSec - seconds) / 60
  const minutes = remain % 60
  const hours = (remain - minutes) / 60
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`
  const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`
  const result = `${hours}:${minutesStr}:${secStr}`
  return result
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
  window.localStorage.removeItem('retryauth')
  return await res.json() as T
}


export function useTwitchAuth() {
  const [authResult, setAuthResult] = useState<boolean | null>(null)

  function doAuthorize() {
    window.location.href = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${clientID}&redirect_uri=${getSiteUrl()}&scope=`
  }

  function onAuthorized(newToken: string) {
    window.localStorage.setItem('token', newToken)
    setAuthResult(true)
  }

  useEffect(() => {
    const initialToken = readToken()
    if (initialToken) {
      onAuthorized(initialToken)
    } else {
      const match = /access_token=([^&]+)/.exec(window.location.hash)
      if (match) {
        window.location.hash = ''
        window.localStorage.setItem('token', match[1])
        onAuthorized(match[1])
      } else {
        doAuthorize()
      }
    }
  }, [])

  useEffect(() => {
    function onError(e: PromiseRejectionEvent) {
      const reqErr = e.reason as { message: string, statusCode: number }
      if (reqErr.statusCode === 401 || reqErr.statusCode === 403) {
        window.localStorage.removeItem('token')
        console.error('Authorization failure')
        if (window.localStorage.getItem('retryauth')) {
          console.error('Retry failed, stopping')
          setAuthResult(false)
        } else {
          window.localStorage.setItem('retryauth', 'true')
          console.log('Retrying')
          doAuthorize()
        }
      }
    }
    window.addEventListener('unhandledrejection', onError)
    return () => {
      window.removeEventListener('unhandledrejection', onError)
    }
  }, [])

  return authResult
}

function getGameUrlName(name: string): string {
  return name.replace(/[^a-z0-9\s]/gi, '').replace(/\s/g, '-').toLowerCase()
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

    const channel_url = `https://www.twitch.tv/${user.login}`
    const category_url = `https://www.twitch.tv/directory/category/${getGameUrlName(channel.game_name)}`

    if (channel) {
      if (stream) {
        return {
          ...stream,
          broadcaster_type: user.broadcaster_type,
          profile_image_url: user.profile_image_url,
          user_description: user.description,
          channel_url,
          offline_image_url: user.offline_image_url,
          viewers_desc: getViewersDesc(stream.viewer_count!),
          content_classification_labels: channel.content_classification_labels,
          category_url,
          uptime_desc: getElapsedDesc(stream.started_at!)
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
          channel_url,
          offline_image_url: user.offline_image_url,
          content_classification_labels: [],
          category_url,
        }
      }
    }
  }
}

export function getSizedThumbnail(url: string, width = 316, height = 178): string {
  return url.replace('{width}', `${width}`).replace('{height}', `${height}`)
}
