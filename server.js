require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
//.env doesn't work very well on replit tried many times
const uri = 'mongodb+srv://ilker:123asd123@learningmongodb.duuyu.mongodb.net/database1?retryWrites=true&w=majority';

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})

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
  responseObject["original_url"] = req.body.url;
  let urlNum = 1; 

  res.json(responseObject)
//from this point on I will continue, use upsert don't forget
  Url.findOneAndUpdate()
})
