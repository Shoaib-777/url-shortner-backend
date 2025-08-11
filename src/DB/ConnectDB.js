import mongoose from 'mongoose'


let IsConnected = false

async function ConnectDB() {
    if(IsConnected || mongoose.connection.readyState === 1){
        console.log("Already Connected To DB")
        return
    }
    try {
        const db = await mongoose.connect(process.env.URI)
        IsConnected = true;
        console.log("Connected To DB Sucessfully")
        return db
    } catch (error) {
        console.error("Error Connecting To DB")
        console.error(error)
    }
}
export default ConnectDB 