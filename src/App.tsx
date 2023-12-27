import TrackedChannels from "./TrackedChannels"
import { useTwitchAuth } from "./Twitch"

function App() {
  const authorized = useTwitchAuth()

  if (authorized) {
    return <TrackedChannels />
  }
  return null
}

export default App
