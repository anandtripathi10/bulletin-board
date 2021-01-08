var flag=0;
const express = require('express');
const app=express();
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Messanger",{useNewUrlParser:true,useUnifiedTopology: true});
const user=new mongoose.Schema({
  name:String,
  pin:String
});
const msgSchema=new mongoose.Schema({
  user_id:String,
  messages:[{
    st:String,
    msg:String
  }]
});
var user_name="login";
var flag=0;
const login=mongoose.model("log",user);
const message=mongoose.model("message",msgSchema);
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs")
app.use(express.static("public"));
app.get("/",function (req,res) {
  res.render("login",{name:user_name});
});
app.get("/home",function (req,res) {
  res.render("home",{});
});
app.get("/chat",function (req,res) {
  message.findOne({user_id:user_name},function (err,result) {
    if(!err)
      res.render("chat",{chats:result.messages});
  });


});
app.post("/home",function (req,res) {
  message.findOne({user_id:user_name},function (err,result) {
    if(!err)
    {
      var obj={
        st:req.body.title,
        msg:req.body.msg
      };
      result.messages.push(obj);
      result.save();
      console.log("sucessfull");
    }
    else {
      console.log(error);
    }
  });
  res.redirect("/chat");
});
app.post("/",function (req,res) {
  console.log(req.body);
  var pass=req.body.password,user=req.body.user_name;
  login.find({name:user,pin:pass},function (err,result) {
    if(result.length===0)
    {
      const obj=new login({
        name:user,
        pin:pass
      });
      obj.save();
      console.log(obj);
      user_name=obj._id;

      const msgobj=new message({
        user_id:user_name,
        messages:[]
      });
      msgobj.save();
    }
    else {
      user_name=result[0]._id;
    }
  });
  res.redirect("/home");
});

app.listen(3000,function () {
  console.log("working");
});
