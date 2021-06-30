const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/urlshort', {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', 'ejs');
const bodyParser = require("body-parser");
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
const urlschema = new mongoose.Schema({
  name: String,
  id: String
});

const Url=mongoose.model("Url",urlschema);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/",function(req,res){
res.render("home",{id:null});
});
app.post("/",function(req,res){
  var uid=Math.random().toString(36).slice(-6);
  const longurl= new Url({name:req.body.urlin ,
  id:uid});
  longurl.save();
  
res.render("home", {id:uid})
console.log(req.body.urlin+"kk"+uid);

});
app.get("/:userid",function(req,res){
  console.log("routing"+ req.params.userid);
Url.find({"id": req.params.userid},function(err,urls){
    if(err){
      console.log(err)
    }
   else{
      console.log("urlfound"+urls[0].name);
      res.redirect(urls[0].name);
   }
})
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });