import './ChannelPage.css'
import { ChannelSummary, getSizedThumbnail } from './twitch'

interface Props {
  channel: ChannelSummary
  close: () => unknown
}

export default function ChannelPage({ channel, close }: Props) {
  // TODO: Set a default offline image
  const thumbUrl = channel.thumbnail_url ?? channel.offline_image_url ?? ''

  const isLive = channel.type === 'live'

  return (
    <div className="channel-page">
      <button type="button" onClick={close}>Close</button>
      <h2 className="broadcaster">{channel.user_name}</h2>
      <div className="type">{channel.broadcaster_type}</div>
      <div className="language">{channel.language}</div>
      <img className="profile-pic" src={channel.profile_image_url} />
      <img className="thumbnail" src={getSizedThumbnail(thumbUrl)} />
      <div className="title">{channel.title}</div>
      <div className="category">{channel.game_name}</div>
      <div className="viewer-count">{channel.viewers_desc}</div>
      {isLive && <div className="live">LIVE</div>}
      <div className="bio">{channel.user_description}</div>
      <ul className="tags">
        {channel.tags.map(tag => <li key={tag}>{tag}</li>)}
      </ul>
    </div>
  )
}
