import './ChannelPage.css'
import { ChannelSummary, getSizedThumbnail } from './twitch'
import partnerLogo from './assets/partner.svg'
import offlineLogo from './assets/offline.svg'
import { useEffect, useRef } from 'react'

interface Props {
  channel: ChannelSummary
  close: () => unknown
  remove: () => unknown
}

export default function ChannelPage({ channel, close, remove }: Props) {
  const thumbUrl = channel.thumbnail_url || channel.offline_image_url || offlineLogo

  const isLive = channel.type === 'live'
  const isPartner = channel.broadcaster_type === 'partner'

  const myRef = useRef(null)

  useEffect(() => {
    function closeChannelPage(e: MouseEvent) {
      const elem = myRef.current as HTMLDivElement | null
      if (!elem?.contains(e.target as Node)) {
        close()
      }
    }
    document.body.addEventListener('mouseup', closeChannelPage)
    return () => {
      document.body.removeEventListener('mouseup', closeChannelPage)
    }
  }, [close])

  useEffect(() => {
    function closeChannelPage(e: KeyboardEvent) {
      console.log(e.key)
      if (e.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('keydown', closeChannelPage)
    return () => {
      window.removeEventListener('keydown', closeChannelPage)
    }
  }, [close])

  return (
    <div className="channel-page shadow2" ref={myRef}>
      <div className="buttons">
        <button type="button" onClick={remove}>Remove</button>&nbsp;
        <button type="button" onClick={close}>Close</button>
      </div>
      <h2 className="broadcaster">
        {channel.user_name} {isPartner && <img className="partner" src={partnerLogo} />}&nbsp;
        {isLive && <>
          <div className="live">LIVE</div> <span className="uptime">{channel.uptime_desc}</span>
        </>}
        {!isLive && <div className="offline">OFFLINE</div>}
      </h2>
      {isLive ? (
        <p>
          Playing <a target="_blank" href={channel.category_url}>{channel.game_name}</a> for {channel.viewers_desc} at <a target="_blank" href={channel.channel_url}>{channel.channel_url}</a><br />
          {channel.content_classification_labels.map((tag, idx) => <span key={idx}><span className="tag">{tag}</span>{' '}</span>)}
        </p>
      ) : (
        <p>
          Last played <a target="_blank" href={channel.category_url}>{channel.game_name}</a> at <a target="_blank" href={channel.channel_url}>{channel.channel_url}</a><br />
          {channel.content_classification_labels.map((tag, idx) => <span key={idx}><span className="tag">{tag}</span>{' '}</span>)}
        </p>
      )}
      <img className="profile-pic shadow" src={channel.profile_image_url} />
      <img className="thumbnail shadow" src={getSizedThumbnail(thumbUrl, 533, 300)} />
      <p className="stream-info">
        <span className="title">{channel.title}</span><br />
        {channel.tags.map((tag, idx) => <span key={idx}><span className="tag">{tag}</span>{' '}</span>)}<br />
      </p>
      {/* {channel.language && <div className="language">Language: {channel.language.toLocaleUpperCase()}</div>} */}
      <p className="bio">
        <b>About {channel.user_name}</b><br />
        {channel.user_description}
      </p>
    </div>
  )
}
