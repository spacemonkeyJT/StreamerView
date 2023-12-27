import { ChannelSummary, getChannelInfo } from "./twitch"

/**
 * Deserializes an object from JSON from the local storage.
 * @param name Name of the item to get.
 */
function getStoredObject<T>(name: string) {
  const json = window.localStorage.getItem(name)
  if (json) {
    return JSON.parse(json) as T
  }
  return undefined
}

/**
 * Serializes an object to JSON and writes it to local storage.
 * @param name The name of the item to set.
 * @param value The object to store.
 */
function setStoredObject(name: string, value: unknown) {
  window.localStorage.setItem(name, JSON.stringify(value))
}

export async function loadChannels(): Promise<ChannelSummary[]> {
  const channelUsers = getStoredObject<string[]>('channels')

  if (channelUsers) {
    return (await Promise.all(channelUsers.map(getChannelInfo))).filter(r => r).map(r => r!)
  }

  return []
}

export function saveChannels(channels: ChannelSummary[]) {
  const channelUsers = channels.map(r => r.user_login)
  setStoredObject('channels', channelUsers)
}
