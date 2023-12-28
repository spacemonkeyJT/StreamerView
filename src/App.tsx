import { useEffect, useState } from "react"
import SearchBox from "./SearchBox"
import TrackedChannels from "./TrackedChannels"
import { ChannelSummary, useTwitchAuth } from "./twitch"
import { loadChannels, saveChannels } from "./storage"
import LoadingSpinner from "./LoadingSpinner"

function App() {
  const [channels, setChannels] = useState<ChannelSummary[]>([])
  const [initialized, setInitialized] = useState(false)

  const authorized = useTwitchAuth()

  useEffect(() => {
    async function initChannels() {
      setChannels(await loadChannels())
      setInitialized(true)
    }
    if (authorized && !initialized) {
      initChannels()
    }
  }, [initialized, authorized])

  function updateChannels(updatedChannels: ChannelSummary[]) {
    saveChannels(updatedChannels)
    setChannels(updatedChannels)
  }

  if (authorized) {
    if (initialized) {
      return <>
        <SearchBox channels={channels} setChannels={updateChannels} />
        <TrackedChannels channels={channels} setChannels={updateChannels} />
      </>
    } else {
      return (
        <div className="center">
          <LoadingSpinner />
        </div>
      )
    }
  }
  return null
}

export default App
