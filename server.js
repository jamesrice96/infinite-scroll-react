//dotenv - .env
const dotenv = require('dotenv');
dotenv.config();
//import rest of stuff
global.fetch = require('node-fetch');
const config = require('universal-config');
const Unsplash = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;
const express = require('express');
const path = require('path');

const unsplash = new Unsplash({
  applicationId: config.get('APPLICATION_ID'),
  secret: config.get('SECRET'),
  callbackUrl: config.get('CALLBACK_URL')
});

const app = express();

//Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));
  //Load client index file
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('/api/photos', async (req, res) => {
  await unsplash.photos
    .listPhotos(req.query.start, req.query.count)
    .then(toJson)
    .then(json => res.json(json));
});

const PORT = process.env.PORT;

console.log(process.env.NODE_ENV);

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
