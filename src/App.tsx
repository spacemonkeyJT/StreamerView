import { useState } from "react"
import SearchBox from "./SearchBox"
import TrackedChannels from "./TrackedChannels"
import { ChannelSummary, useTwitchAuth } from "./twitch"

function App() {
  const [channels, setChannels] = useState<ChannelSummary[]>([])

  const authorized = useTwitchAuth()

  if (authorized) {
    return <>
      <SearchBox channels={channels} setChannels={setChannels} />
      <TrackedChannels channels={channels} />
    </>
  }
  return null
}

export default App
