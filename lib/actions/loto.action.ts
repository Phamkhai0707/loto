"use server";

import { revalidatePath } from "next/cache";
import Loto from "../models/Loto.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { UserButton } from "@clerk/nextjs";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createLoto({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const createdLoto = await Loto.create({
      text,
      author,
      community: null,
    });

    // update user model
    await User.findByIdAndUpdate(author, {
      $push: { lotos: createdLoto._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating loto: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch the posts that have no parents (top-level lotos...)
  const postsQuery = Loto.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Loto.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchLotoById(id: string) {
  connectToDB();

  try {
    // TODO: Populate Community
    const loto = await Loto.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Loto,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return loto;
  } catch (error: any) {
    throw new Error(`Error fetching loto: ${error.message}`);
  }
}

export async function addCommentToLoto(
  lotoId: string,
  commentText: string,
  UserId: string,
  path: string
) {
  connectToDB();

  try {
    // find the original loto by its ID
    const originalLoto = await Loto.findById(lotoId);

    if (!originalLoto) {
      throw new Error("Loto not found");
    }

    // create a new loto with the comment text
    const commentLoto = new Loto({
      text: commentText,
      author: UserId,
      parentId: lotoId,
    });

    // save the new loto
    const savedCommentLoto = await commentLoto.save();

    // update the original loto to include the new comment
    originalLoto.children.push(savedCommentLoto._id);

    // save the original loto
    await originalLoto.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to loto: ${error.message}`);
  }
}
