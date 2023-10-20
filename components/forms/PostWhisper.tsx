"use client"

import React, { ChangeEvent, useEffect, useState } from 'react'
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'

import { updateUser } from '@/lib/actions/user.actions'
import { WhisperValidation } from '@/lib/validations/whisper'
import { createWhisper } from '@/lib/actions/whisper.actions'


export default function PostWhisper({ userId }: { userId: String }) {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(WhisperValidation),
        defaultValues: {
            whisper: "",
            accountId: userId,
        }
    });

    const onSubmit = async(values: z.infer<typeof WhisperValidation>) => {
        await createWhisper({
            text:values.whisper,
            author:userId,
            communityId:null,
            path:pathname
        })

        router.push("/")
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10
            mt-10">
                <FormField
                    control={form.control}
                    name="whisper"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>Content </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea rows={15} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className='bg-primary-500'>
                    Submit
                </Button>
            </form>
        </Form>
    )
}