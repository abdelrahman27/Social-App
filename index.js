import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import  schedule  from 'node-schedule'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })

import  initApp  from './src/index.router.js'
import userModel from './DB/model/user.model.js'
import sendEmail, { createHtml } from './src/utils/email.js'

const app = express()



const port = process.env.PORT
initApp(app ,express)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const job = schedule.scheduleJob("0 0 21 * * 6",async function(){
// const job = schedule.scheduleJob("0 37 * * * *",async function(){
    const usersNotConfirm = await userModel.find({confirmEmail:false})
    console.log(usersNotConfirm);
    for (let i = 0; i < usersNotConfirm.length; i++) {
        console.log(1);
        let message ="you have to confirm your email or it be deleted"
        let html =createHtml(message)
        await sendEmail(usersNotConfirm[i].email,"you have to confirm your email or it be deleted",html)
    }
})


// let timePost ="2025-10-07T09:16:53.019"
// let today = new Date()
// let x= today.getFullYear()
// let b = today.getMonth() +1
// let c = today.getDate()
// let f = today.getHours()
// let z = x.toString()+"-" + b.toString()+"-" +c.toString()
// console.log(today , x,b,c,f);
// console.log(z);
// let timeOfDayStart  =new Date(z) 
// let yesterdayIsST =x.toString()+"-"+b.toString()+"-"+(c - 1).toString()
// console.log(yesterdayIsST);
// yesterdayIsST = new Date(yesterdayIsST)
// console.log(yesterdayIsST);
// console.log(timeOfDayStart);
// console.log(timePost);
// if (yesterdayIsST < timePost < timeOfDayStart) {
//     console.log("POSTS OF YESTERDAY");
// }
// else if(timeOfDayStart<timePost){
//     console.log("POSTS OF TODAY");
// }else{
//     console.log("POSTS no posts");
// // }

// let dateNow = new Date()
// let dateToday = new Date(dateNow.getFullYear(), dateNow.getMonth(), (dateNow.getDate() - 1))
// console.log(dateToday);



