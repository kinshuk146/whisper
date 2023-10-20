"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.models";
import { connectToDB } from "../mongoose"
import Whisper from "../models/whisper.models";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: String,
    username: String,
    name: String,
    bio: String,
    image: String,
    path: string
}

export async function updateUser(
    {
        userId,
        username,
        name,
        bio,
        image,
        path,
    }: Params)
    : Promise<void> {
    connectToDB();

    try {
        await User.findOneAndUpdate({ id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            { upsert: true }
        );

        if (path === "/profile/edit") {
            revalidatePath(path)
        }
    }
    catch (e) {
        console.log('Failed to update user ', e);
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB();
        return await User
            .findOne({ id: userId })
        // .populate({
        //     path:'communities',
        //     model:Community
        // })  
    }
    catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message} `)
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();

        const whispers = await User.findOne({ id: userId }).
            populate(
                {
                    path: 'whispers',
                    model: Whisper,
                    populate: {
                        path: 'children',
                        model: Whisper,
                        populate: {
                            path: 'author',
                            model: User,
                            select: 'name image id'
                        }
                    }
                }
            )

        return whispers
        //Find all whispers authored by the user with the given user Id
    }

    catch (e) {
        console.log('Failed to fetch Whispers', e);
    }
}


export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
}: {
    userId: string,
    searchString: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}) {
    try {
        connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if (searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();
        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    }

    catch (error: any) {
        throw new Error(`Failed to fetch Users: ${error.message}`);
    }
}

export async function getActivity({ userId }: { userId: string }) {
    try {
        connectToDB();

        const userWhispers = await Whisper.find({ author: userId });

        const childWhisperIds = userWhispers.reduce((acc, userWhisper) => {
            return acc.concat(userWhisper.children);
        })

        const replies = await Whisper.find({
            _id: { $in: childWhisperIds },
            author: { $ne: userId }
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })
        return replies;
    }

    catch (e) {
        console.log('Failed to fetch activity ', e)
    }


}