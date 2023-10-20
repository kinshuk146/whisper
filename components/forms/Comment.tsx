"use client"

import React, { ChangeEvent, useEffect, useState } from 'react'
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CommentValidation } from '@/lib/validations/whisper'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { addCommentToThread, createWhisper } from '@/lib/actions/whisper.actions'
import Image from 'next/image'


interface Props {
    whisperId: string,
    currentUserImg: string,
    currentUserId: string
}


const Comment = ({ whisperId, currentUserImg, currentUserId }: Props) => {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            whisper: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(whisperId,values.whisper,JSON.parse(currentUserId),pathname);
        form.reset();
        router.push("/")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form">
                <FormField
                    control={form.control}
                    name="whisper"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-3 w-full'>
                            <FormLabel>
                                <Image src={currentUserImg} alt="Profile image" width={48} height={48}
                                    className='rounded-full object-cover' />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input type='text' placeholder='Comment...' className='no-focus text-light-1 outline-none' {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className='comment-form_btn'>
                    Reply
                </Button>
            </form>
        </Form>
    )
}

export default Comment