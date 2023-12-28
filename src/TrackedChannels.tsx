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

function LiveCard({ channel, click }: CardProps) {
  return (
    <div className="live-card grow" onClick={() => click(channel)}>
      <div className="thumbnail"><img src={getSizedThumbnail(channel.thumbnail_url!)} /></div>
      <div className="title">{channel.title}</div>
      <div className="uptime">🔴 {getElapsedDesc(channel.started_at!)}</div>
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
