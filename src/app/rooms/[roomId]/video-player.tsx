"use client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
  SpeakerLayout,
  CallControls
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Room } from "@/db/schema";

const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY;
const token =
  "add your token";

export function DevDuoVideo({ room }: { room: Room }) {
  const session = useSession();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    if(!room){
      return;
    }
    if (!session.data || !apiKey) {
      return;
    }
    const userId = session.data.user.id;
    const client = new StreamVideoClient({
      apiKey,
      user: { id: userId },
      token,
    });
    setClient(client);
    const call = client.call("default", room.id);
    call.join({ create: true });
    setCall(call);
    return () => {
      call.leave();
      client.disconnectUser();
    };
  }, [session,room]);

  return (
    client &&
    call && (
      <StreamVideo client={client}>
        <StreamTheme>
        <StreamCall call={call}>
          <SpeakerLayout/>
          <CallControls/>
        </StreamCall>
        </StreamTheme>
      </StreamVideo>
    )
  );
}
