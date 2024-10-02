const { faker, tr } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app=express();

app.set("view engine","ejs");
const path = require('path');

app.set("views",path.join(__dirname,"/views"));

const methodoverride = require('method-override');
app.use(methodoverride("_method"));
app.use(express.urlencoded({extended:true}));

port=8080;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta',
  password: 'abhishek00'
});



let createRandomUser= ()=> {
  return [
     faker.datatype.uuid(),
    faker.internet.userName(),
     faker.internet.email(),

   faker.internet.password(),
 
  ];
}

// let data=[];
// for(let i=1;i<=50;i++){
//   data.push(createRandomUser());
// }
// let q="insert into user (id,username,email,password) values ?";

app.get("/",(req,res)=>{
  
  let count="select count(*) from user";

try{
connection.query(count,(err,result)=>{
  if(err)throw err;
  let count=result[0]["count(*)"]
  res.render("home.ejs",{count});
 
});}catch(err){
  console.log(err);
};



});



app.get("/user",(req,res)=>{
  
  let count="select * from user";

try{
connection.query(count,(err,result)=>{
  if(err)throw err;
  let count=result;
  
  res.render("user.ejs",{count});
 
});}catch(err){
  console.log(err);
};

});

//edit
app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err)throw err;
      let data=result[0];
      
      res.render("edit.ejs",{data});
     
    });}catch(err){
      console.log(err);
    };
    

 

});
//update
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`;
  let{password: formpassword,username: newusername}=req.body;
  
  try{
    connection.query(q,(err,result)=>{
      if(err)throw err;
      let user=result[0];
     if(formpassword!=user.password){
      res.send("wrong Password")
     }else{
      try{
        let q2=`update user set username='${newusername}' where id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err)throw err;
          

          res.redirect("/user");
         
        });}
        catch(err){
          console.log(err);
        };
      
     }
    });}
    catch(err){
      console.log(err);
    };
  
})

app.listen(port,()=>{
  console.log("start");
});