const express=require("express");
const users=require("./MOCK_DATA.json")
const fs=require('fs')
const app= express();
const port=3000;

//middleware
app.use(express.urlencoded({extended:false}));

//routes
app.get('/',(req,res)=>{
    res.send("this is home page")
})
app.get('/api/users',(req,res)=>{
    return res.json(users)
})
app.get('/users',(req,res)=>{
   const html=`
   <ul>
   ${users.map((user)=>`<li>${user.first_name}</li>`).join("  ")})}</ul>
   `
   res.send(html);
})
app.get('/about',(req,res)=>{
    res.send("this is about page.   Hi "+req.query.name)
})
//dynamic path 

app.get("/api/users/:id",(req,res)=>{
    const id=Number(req.params.id);
    const user= users.find((user)=> user.id===id);
    return res.json(user);

})

app.post('/api/users',(req,res)=>{
    const body=req.body
   users.push({ id: users.length+1,...body})
   fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{

       return res.json({status:"success",id :users.length})
   })

})








app.listen(port,()=>{
    console.log(`Server is running on ${"http://localhost:3000"}`)
})