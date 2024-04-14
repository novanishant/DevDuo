"use server";

import { Room} from "@/db/schema";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {editRoom,getRoom} from "@/data-access/rooms";
import { revalidatePath } from "next/cache";

export async function editRoomAction(roomData:Omit<Room, "userId">) {
  const session = await getSession();
  if (!session) {
    throw new Error("you must be logged in to create this room");
  }
  const room = await getRoom(roomData.id);
  if (room?.userId !== session.user.id) {
    throw new Error("User not authorized");
  }

  await editRoom({...roomData,userId:room.userId});
  revalidatePath("/your-rooms");
  revalidatePath(`/edit-room/${roomData.id}`);
  redirect("/your-rooms");
}
