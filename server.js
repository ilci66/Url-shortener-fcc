require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
//.env doesn't work very well on replit tried many times
const uri = 'mongodb+srv://ilker:123asd123@learningmongodb.duuyu.mongodb.net/database2?retryWrites=true&w=majority';
//useFindAndModify: false  for an error I kept getting on console
mongoose.connect(uri, {useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true})

// Basic Configuration
const port = process.env.PORT || 3000;
//app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const urlSchema = new mongoose.Schema({
  url: {type:String, required:true},
  short: Number
});
const Url = mongoose.model('Url', urlSchema);

let responseObject = {};
//handle the post request with body-parser, required up there(line4)
app.post("/api/shorturl", bodyParser.urlencoded({ extended: false }),(req, res) => {
  let inputUrl = req.body.url;
  let urlNum = 1;
//copied this regex from stack overflow
//seems to me that it's working but doesn'T pass tests
  let regexUrl = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)

  if(!inputUrl.match(regexUrl)){
    let errText = { error: 'invalid url' } 
    res.json({ error: 'invalid url' })
//with this return here the execution of the rest is stoppped
    return;
  } else {  
  
  //without this else here it was still saving the invalid urls
    responseObject["original_url"] = inputUrl;

  
  // responseObject["original_url"] = req.body.url;
  // responseObject["short_url"] = urlNum;

  //res.json(responseObject)
//from this point on I will continue, use upsert don't forget

  // Url.findOneAndUpdate({url:originalUrl},{url:originalUrl, short: urlNum}, {new:true, upsert:true}, (error, data) => {
  //   Url.findOne({}, (err, data) => {
  //     if(!err){
  //       res.json(data)
  //     }
  //   })
  // })
// Url.findOne({}).sort({short:-1}).exec((error, data)=> {
//   Url.findOneAndUpdate({url:originalUrl},{url:originalUrl, short: urlNum}, {new:true, upsert:true},(err, data) => {
//     if(!err){
//       responseObject["original_url"] = data.url;
//       responseObject["short_url"] = data.short;
//       res.json(responseObject)
//       }
//   })
// })
// couldn't figure out yet

Url.findOne({}).sort({short:-1}).exec((error, data) => {
  if(!error && data != undefined) {
  //if there a result just increase the urlNum
  //so there won't be duplicates in your database
    urlNum = data.short + 1;
  } if(!error){
  //if there is no with that urldocument, create one, use upsert 
  //urlNum is 1 by default, finally understood fully :D
    Url.findOneAndUpdate(
    {url:inputUrl}, 
    {url:inputUrl, short:urlNum}, 
    {new:true, upsert:true}, 
    (error, newData) => {
      responseObject["short_url"] = newData.short;
      res.json(responseObject)
    })
  }
})}
});

//now to handle redirect
