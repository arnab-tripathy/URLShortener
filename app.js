const express = require('express');
const app = express();

const dblink="mongodb+srv://arnab:msd007@cluster0.ugwnc.mongodb.net/test?retryWrites=true&w=majority";
const mongoose = require('mongoose');
mongoose.connect(dblink, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify:false});
app.set('view engine', 'ejs');
const bodyParser = require("body-parser");
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected");
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
  console.log("in post");
  var uid=Math.random().toString(36).slice(-6);
  const longurl= new Url({name:req.body.urlin ,
  id:uid});
  longurl.save();
  console.log(req.body.urlin+"kk"+uid);
res.render("home", {id:uid})


});
app.get("/:userid", (req,res) =>{
  console.log("in get");
  try {
    Url.find({"id": req.params.userid},function(err,urls){
      if(err){
        console.log(err)
      }
     else{
        console.log("urlfound"+urls);
        res.redirect(urls[0].name);
     }
  })
  } catch (error) {
    console.log(error);
  }
 // console.log("routing"+ req.params.userid);

});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });