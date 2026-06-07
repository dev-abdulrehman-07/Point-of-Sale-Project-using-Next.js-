import mongoose from "mongoose";

const mongoDB = process.env.MONGODB_URL


let cached = global.mongoose;


if (!cached) {
    cached = global.mongoose = {conn: null,promise:null};   
}


async function dbConnection(){
if (cached.conn) {
    return cached.conn
}

if (!cached.promise) {
    cached.promise = mongoose.connect(`${mongoDB}`);
}
try {
    cached.conn = await cached.promise;
} catch (error) {
if(error instanceof Error){
    console.log(`${error}`)
}else{
    console.log(`${error}`)
}    
}


}

export default dbConnection