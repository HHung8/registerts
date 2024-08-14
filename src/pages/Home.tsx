import {
  ChannelList,
  Channel,
  Chat,
  LoadingIndicator,
  Window,
  MessageInput,
  ChannelHeader,
  MessageList,
} from "stream-chat-react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Home = () => {
  const { user, streamChat } = useAuth();

  useEffect(() => {
    if (streamChat) {
      const createChannel = async () => {
        // Kiểm tra xem người dùng hiện tại đã có kênh nào chưa
        const channels = await streamChat.queryChannels({
          members: { $in: [user.id] },
        });

        if (channels.length === 0) {
          // Nếu không có kênh nào, tạo một kênh mới
          const channel = streamChat.channel(
            "messaging",
            `channel-${user.id}`,
            {
              name: `My Channel for ${user.name}`,
              members: [user.id], // Thêm ID người dùng vào kênh
            }
          );
          await channel.create();
        }
      };

      createChannel();
    }
  }, [streamChat, user]);
  if (streamChat == null) {
    return <LoadingIndicator />;
  }
  return (
    <Chat client={streamChat}>
      <ChannelList />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

export default Home;
