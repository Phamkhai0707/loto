"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Loto from "../models/Loto.model";

interface Params {
  userId: string;
  path: string;
  userName: string;
  name: string;
  bio: string;
  image: string;
}

export async function updateUser({
  userId,
  path,
  userName,
  name,
  bio,
  image,
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        userName: userName.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    // .populate({
    //   path: 'communities',
    //   model: Community
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // find all lotos authored by user with the given userId

    // TODO: populate community
    const lotos = await User.findOne({ id: userId }).populate({
      path: "lotos",
      model: Loto,
      populate: {
        path: "children",
        model: Loto,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return lotos;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}
