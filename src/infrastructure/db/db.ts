import mongoose from "mongoose";


const connectDb = async (dbUrl: string) => {
    try {
        await mongoose.connect(dbUrl);
        console.log("Database connected...");
    } catch (err) {
        console.log(err)
    }
}


export default connectDb;