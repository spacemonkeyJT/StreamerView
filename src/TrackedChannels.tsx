import { ChannelSummary } from "./twitch"
import './TrackedChannels.css'

interface Props {
  channels: ChannelSummary[]
}

export default function TrackedChannels(props: Props) {
  console.log(props)
  return (
    <div className="tracked-channels">
      <table>
        <thead>
          <tr>
            <th>Profile Pic</th>
            <th>Username</th>
            <th>Status</th>
            <th>Category</th>
            <th>Viewers</th>
            <th>Uptime</th>
            <th>Title</th>
            <th>Bio</th>
          </tr>
        </thead>
        <tbody>
          {props.channels && props.channels.map(channel => (
            <tr key={channel.user_id}>
              <td><img src={channel.profile_image_url} className="profile-pic" /></td>
              <td>{channel.user_name}</td>
              <td>{channel.type}</td>
              <td>{channel.game_name}</td>
              <td>{channel.viewer_count}</td>
              <td>{channel.started_at}</td>
              <td>{channel.title}</td>
              <td>{channel.user_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
