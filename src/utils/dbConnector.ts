import mongoose from "mongoose";

export const connectDb = (database: string) => {
    try {
        mongoose.connect(database).then(()=>{
            console.log("Database connected!");
        
        mongoose.connection.on('disconnected',()=>{
            console.log("Database disconnected!");
        });

        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            process.exit(0);
          });

        }).catch((err:any)=>{
            throw err;
        });
    } catch (error) {
        console.log(`Unable to Connect to Database: ${error}`);        
    }
}