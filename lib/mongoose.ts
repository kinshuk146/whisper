import mongoose from 'mongoose'

let isConnected = false;

export const connectToDB=async()=>{
    mongoose.set('strictQuery',true);

    if(!process.env.MONGODB_URL){
        return console.log('MONGODB_URL NOT FOUND')
    }

    if(isConnected) return console.log('ALREADY CONNECTED TO MONGODB');

    try{
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected=true;
        console.log('Connected to mongodb')
    }catch(e){
        console.log(e);
    }
}