const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 4000;
const app = express();
const server = require('http').createServer(app);


const router = express.Router();
const mongoose = require('mongoose');

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
} else {
  app.use(express.static('client/public'));
}

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/3000',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
).then(() => {
  // Define API routes here
  app.use('/api', require('./utils/api')(mongoose));
  

  // Send every other request to the React app
  // Define any API routes before this runs
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/src/public/index.html'));
  });

  app.listen(PORT, () => {
    console.log(`App running on port: " ${PORT}!`);
  });
});