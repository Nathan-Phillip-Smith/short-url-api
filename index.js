require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlsList = [];
const shortUrls = [];

app.post('/api/shorturl', (request, response) => {
  const url = request.body.url;
  const foundIndex = urlsList.indexOf(url)
  if(!url.includes("https://") && !url.includes("http://")) {
    return response.json({ error: 'invalid url'})
  }
  
if (foundIndex < 0) {
  urlsList.push(url)
  shortUrls.push(shortUrls.length)

  return response.json({original_url: url, short_url: shortUrls.length - 1})
}
  return response.json({original_url: url, short_url: shortUrls[foundIndex]})
  
});

app.get('/api/shorturl/:shorturl', (request,response) => {
  const shorturl = Number(request.params.shorturl)
  const foundIndex = shortUrls.indexOf(shorturl)

  if(foundIndex < 0) {
    return response.json({"error": "No short Url found for the given input"})
  }

  response.redirect(urlsList[foundIndex])
})





app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
