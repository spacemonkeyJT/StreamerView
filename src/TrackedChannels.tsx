import { ChannelSummary, getSizedThumbnail } from "./twitch"
import './TrackedChannels.css'

interface Props {
  channels: ChannelSummary[]
  setChannels: (channels: ChannelSummary[]) => void
  setSelectedChannel: (channel: ChannelSummary) => unknown
}

interface CardProps {
  channel: ChannelSummary
  click: (channel: ChannelSummary) => unknown
}



function LiveCard({ channel, click }: CardProps) {
  return (
    <div className="live-card grow shadow" onClick={() => click(channel)}>
      <div className="thumbnail"><img src={getSizedThumbnail(channel.thumbnail_url!)} /></div>
      <div className="title">{channel.title}</div>
      <div className="uptime">🔴 {channel.uptime_desc}</div>
      <div className="profile-info">
        <img className="profile-pic" src={channel.profile_image_url} />
        <div className="broadcaster">{channel.user_name}</div>
        <div className="category">{channel.game_name}</div>
      </div>
      <div className="viewers">{channel.viewers_desc}</div>
    </div>
  )
}

function OfflineCard({ channel, click }: CardProps) {
  return (
    <div className="offline-card" onClick={() => click(channel)}>
      <img className="profile-pic" src={channel.profile_image_url} />
      <div className="broadcaster">{channel.user_name}</div>
    </div>
  )
}

function NoChannelsMessage() {
  return <p>No channels found.</p>
}

export default function TrackedChannels(props: Props) {
  const liveChannels = props.channels.filter(r => r.type === 'live')
  const offlineChannels = props.channels.filter(r => r.type !== 'live')

  return (
    <div className="tracked-channels">
      <div className="live-channels">
        <h3>Live Channels</h3>
        {liveChannels.length > 0 ? liveChannels.map(channel => (
          <LiveCard key={channel.user_id} channel={channel} click={props.setSelectedChannel} />
        )) : <NoChannelsMessage />}
      </div>
      <div className="offline-channels">
        <h3>Offline Channels</h3>
        {offlineChannels.length > 0 ? offlineChannels.map(channel => (
          <OfflineCard key={channel.user_id} channel={channel} click={props.setSelectedChannel} />
        )) : <NoChannelsMessage />}
      </div>
    </div>
  )
}
