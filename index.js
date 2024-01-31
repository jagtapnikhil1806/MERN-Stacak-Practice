const express=require("express");
// const users=require("./MOCK_DATA.json")
const fs=require('fs')
const mongoose= require ("mongoose");
const app= express();
const port=3000;



//middleware
app.use(express.urlencoded({extended:false}));
// app.use((req,res,next)=>{
//     console.log(`Time : ${Date.now()}`);
//     next();
// })

//connection 
mongoose.connect("mongodb://127.0.0.1:27017/nodejs")
.then(()=>{console.log("Mongodb Connected !")})
.catch((err)=>{console.log("Mongodb ERR:",err)})

//schema
const userSchema=mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    job_title:{
        type:String,
        required:true
    },

})
//user model
const User=mongoose.model('user',userSchema);
//routes
app.get('/',(req,res)=>{
    res.send("this is home page")
})
app.get('/users',async(req,res)=>{
    const alldbusers= await User.find({})
    const html=`
    <ul>
    ${alldbusers.map((user)=>`<li>${user.first_name}-${user.email}</li>`).join(" ")}</ul>
    `
    res.send(html);
})
app.get('/api/users',async(req,res)=>{
    const alldbusers= await User.find({})
    return res.json(alldbusers)
})
app.get('/about',(req,res)=>{
    res.send("this is about page.   Hi "+req.query.name)
})
//dynamic path 

app.route("/api/users/:id").get(async(req,res)=>{
    // const id=Number(req.params.id);
    // const user= users.find((user)=> user.id===id);
    const user=await User.findById(req.params.id)
    if(!user){res.status(404).json({status:'user not found '})} ;
      return res.json(user);

}).patch(async(req,res)=>{
    await  User.findByIdAndUpdate(req.params.id, {last_name:"changed"})
    return res.json({status:"success"})
}).delete(async(req,res)=>{
    await User.findByIdAndDelete(req.params.id)
    return res.json({status:"success"})
})

app.post('/api/users',async(req,res)=>{

    const body=req.body
//    users.push({ id: users.length+1,...body})
//    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
// if (!body ||!first_name||!last_name||!email||!email||!job_title){

//     return res.status(400).json({status:"bad request"})
    
// }
const result=await User.create({
    first_name : body.first_name,
    last_name:body.last_name,
    email:body.email,
    gender:body.gender,
    job_title:body.job_title,

})
console.log("Result", result)
return res.status(201).json({status:"success"})
})
 






app.listen(port,()=>{
    console.log(`Server is running on ${"http://localhost:3000"}`)
})