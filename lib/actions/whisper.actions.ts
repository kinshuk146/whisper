"use server"

import { connectToDB } from "../mongoose"
import Whisper from "../models/whisper.models"
import User from "../models/user.models";
import { revalidatePath } from "next/cache";
import { Concert_One } from "next/font/google";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}


export async function createWhisper({ text, author, communityId, path }: Params) {
    connectToDB();

    const createdWhisper = await Whisper.create(
        { text, author, community: null }
    );

    //Update User model

    await User.findByIdAndUpdate(author, {
        $push: { whispers: createdWhisper._id }
    })

    revalidatePath(path);
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();
    //Fetch the posts that have no parents
    //Calculate the number of posts to skip

    const skipAmount = (pageNumber - 1) * pageSize;

    const postsQuery = Whisper.find({ parentId: { $in: [null, undefined] } }).sort({ createdAt: 'desc' })
        .skip(skipAmount).populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: 'author',
            model: User,
            select: "_id name parentId image"
        })

    const totalPostsCount = await Whisper.countDocuments({ parentId: { $in: [null, undefined] } });
    const posts = await postsQuery.exec();
    const isNext = totalPostsCount > skipAmount + posts.length

    return { posts, isNext }
}

export async function fetchWhisperById(id: string) {
    connectToDB();

    try {
        const whisper = await Whisper.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Whisper,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec();

            return whisper
    }

    catch (e) {
        console.log("Error fetching thread ",e)
    }
}

export async function addCommentToThread(whisperId:string,commentText:string,userId:string,path:string)
{
    connectToDB();
    try{
        //Find the original thread by its ID

        const originalWhisper = await Whisper.findById(whisperId);
        if(!originalWhisper)
        {
            throw new Error("Thread not found");
        }
        const commentWhisper = new Whisper({
            text: commentText,
            author:userId,
            parentId:whisperId,
        })
        const savedCommentWhisper = await commentWhisper.save();
        originalWhisper.children.push(savedCommentWhisper._id);
        await originalWhisper.save();
        revalidatePath(path);
    }
    catch(e){
        console.log("Error ",e);
    }
}