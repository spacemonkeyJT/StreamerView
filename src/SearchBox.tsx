import { useState } from "react"
import { ChannelSummary, getChannelInfo } from "./twitch"
import './SearchBox.css'

interface Props {
  channels: ChannelSummary[]
  setChannels: (channels: ChannelSummary[]) => void
}

export default function SearchBox(props: Props) {
  const [username, setUsername] = useState('')

  async function doSubmit() {
    if (username) {
      const channel = await getChannelInfo(username)
      if (channel &&!props.channels.find(r => r.user_id === channel.user_id)) {
        props.setChannels([...props.channels, channel])
      }
    }
    setUsername('')
  }

  return <div className="search-box">
    <input type="text" value={username}
      placeholder="Enter channel name..."
      onChange={e => setUsername(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          doSubmit()
        }
      }} />
    <button type="button" onClick={() => { doSubmit() }}>Add</button>
  </div>
}
