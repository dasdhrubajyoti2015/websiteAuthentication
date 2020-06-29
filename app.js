//jshint esversion:6
//Level 4 encryption
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
var ejs=require("ejs");
const mongoose=require("mongoose");
//const encrypt = require('mongoose-encryption');
//var md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;



const app=express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
                      email:String,
                      password:String
                   });


//userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const user =new mongoose.model("user",userSchema);



app.get("/",function(req,res){

  res.render("home");

});

app.get("/login",function(req,res){

  res.render("login");

});

app.get("/register",function(req,res){

  res.render("register");

});

app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      const newUser=new user({
                              email   :req.body.username,
                              password:hash
                         });



                     newUser.save(function(err){
                       if(err)
                       {
                         console.log(err);
                       }
                       else
                       {
                         res.send("<h1>Congrats!You have successfully registered.</h1>");
                       }
                     });
                      });


});

app.post("/login",function(req,res){

// calling findOne decrypts the password field
                          user.findOne({email:req.body.username},function(err,userinfo){

                            if(!err){

                              bcrypt.compare(req.body.password,userinfo.password, function(err, result) {
                             if (result == true)
                             {

                              res.render("secrets");
                            }
                            else
                            {
                              res.send("<h1>Wrong Password.</h1>");
                            }
                          });
                          }
                          });


});




app.listen(3000,function(){
   console.log("Server is running on port 3000.");
});
