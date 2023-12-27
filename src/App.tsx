import { useEffect, useState } from "react"
import SearchBox from "./SearchBox"
import TrackedChannels from "./TrackedChannels"
import { ChannelSummary, useTwitchAuth } from "./twitch"
import { loadChannels, saveChannels } from "./storage"

function App() {
  const [channels, setChannels] = useState<ChannelSummary[]>([])

  const authorized = useTwitchAuth()

  useEffect(() => {
    async function initChannels() {
      setChannels(await loadChannels())
    }
    if (authorized && channels.length === 0) {
      initChannels()
    }
  }, [channels, authorized])

  if (authorized) {
    return <>
      <SearchBox channels={channels} setChannels={updatedChannels => {
        saveChannels(updatedChannels)
        setChannels(updatedChannels)
      }} />

      <TrackedChannels channels={channels} />
    </>
  }
  return null
}

export default App
