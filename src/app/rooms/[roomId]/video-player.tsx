"use client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  CallParticipantsList,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Room } from "@/db/schema";
import { generateTokenAction } from "./actions";
import { useRouter } from "next/navigation";
const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY;

export function DevDuoVideo({ room }: { room: Room }) {
  const session = useSession();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!room) {
      return;
    }
    if (!session.data || !apiKey) {
      return;
    }
    const userId = session.data.user.id;
    const client = new StreamVideoClient({
      apiKey,
      user: { id: userId, name: session.data.user.name ?? undefined, image: session.data.user.image ?? undefined },
      tokenProvider: () => generateTokenAction(),
    });
    setClient(client);
    const call = client.call("default", room.id);
    call.join({ create: true });
    setCall(call);
    return () => {
      call.leave().then(
        () => client.disconnectUser()
      ).catch(console.error);
};
  }, [session, room]);

return (
  client &&
  call && (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <SpeakerLayout />
          <CallControls onLeave={() => {
            router.push("/");
          }} />
          <CallParticipantsList onClose={() => undefined} />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  )
);
}
