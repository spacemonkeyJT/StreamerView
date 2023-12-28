import { ChannelSummary } from "./twitch"
import './TrackedChannels.css'

interface Props {
  channels: ChannelSummary[]
  setChannels: (channels: ChannelSummary[]) => void
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

function getViewersDesc(viewers: number) {
  if (viewers < 1000) {
    return `${viewers} viewers`
  }
  if (viewers < 10000) {
    return `${Math.round(viewers / 100) / 10}K viewers`
  }
  return `${Math.round(viewers / 1000)}K viewers`
}

function LiveCard({ channel }: { channel: ChannelSummary }) {
  return <div className="live-card grow">
    <a href={channel.channel_url} target="blank">
      <div className="thumbnail"><img src={channel.thumbnail_url?.replace('{width}', '316').replace('{height}', '178')} /></div>
    </a>
    <div className="title">{channel.title}</div>
    <div className="uptime">🔴 {getElapsedDesc(channel.started_at!)}</div>
    <div className="profile-info">
      <img className="profile-pic" src={channel.profile_image_url} />
      <div className="broadcaster">{channel.user_name}</div>
      <div className="category">{channel.game_name}</div>
    </div>
    <div className="viewers">{getViewersDesc(channel.viewer_count!)}</div>
  </div>
}

function OfflineCard({ channel }: { channel: ChannelSummary }) {
  return <div className="offline-card">
    <a href={channel.channel_url} target="blank">
      <img className="profile-pic" src={channel.profile_image_url} />
    </a>
    <div className="broadcaster">{channel.user_name}</div>
  </div>
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
        {liveChannels.length > 0 ? liveChannels.map(channel => <LiveCard key={channel.user_id} channel={channel} />) : <NoChannelsMessage />}
      </div>
      <div className="offline-channels">
        <h3>Offline Channels</h3>
        {offlineChannels.length > 0 ? offlineChannels.map(channel => <OfflineCard key={channel.user_id} channel={channel} />) : <NoChannelsMessage />}
      </div>
    </div>
  )
}
