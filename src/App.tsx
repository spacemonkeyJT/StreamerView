import { useEffect, useState } from "react"
import SearchBox from "./SearchBox"
import TrackedChannels from "./TrackedChannels"
import { ChannelSummary, useTwitchAuth } from "./twitch"
import { loadChannels, saveChannels } from "./storage"
import LoadingSpinner from "./LoadingSpinner"
import ChannelPage from "./ChannelPage"

function App() {
  const [channels, setChannels] = useState<ChannelSummary[]>([])
  const [initialized, setInitialized] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<ChannelSummary | undefined>()

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

  function removeChannel(channel: ChannelSummary) {
    setSelectedChannel(undefined)
    updateChannels(channels.filter(r => r !== channel))
  }

  if (authorized) {
    if (initialized) {
      return <>
        {selectedChannel && (
          <ChannelPage
            channel={selectedChannel}
            close={() => setSelectedChannel(undefined)}
            remove={() => removeChannel(selectedChannel)}
          />
        )}
        <SearchBox channels={channels} setChannels={updateChannels} />
        <TrackedChannels channels={channels} setChannels={updateChannels} setSelectedChannel={setSelectedChannel} />
      </>
    } else {
      return (
        <div className="center">
          <LoadingSpinner />
        </div>
      )
    }
  } else if (authorized === false) {
    return <p>Authorization failed.</p>
  }
  return null
}

export default App
