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

  function updateChannels(updatedChannels: ChannelSummary[]) {
    saveChannels(updatedChannels)
    setChannels(updatedChannels)
  }

  if (authorized) {
    return <>
      <SearchBox channels={channels} setChannels={updateChannels} />
      <TrackedChannels channels={channels} setChannels={updateChannels} />
    </>
  }
  return null
}

export default App
