const express=require('express');
const {dbconnect}=require('./Config/databases');
const sarswatiroutes=require('./Routes/sarswatiroutes');
const cookieParser = require('cookie-parser')
const fileUpload=require('express-fileupload');
const app=express();


const bodyParser = require('body-parser')
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json())

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


app.get('/',(req,res)=>{
    return res.send("Hello");
})

app.use('/api/v1',sarswatiroutes);

const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log("Server is running at PORT ",PORT);
})

dbconnect();