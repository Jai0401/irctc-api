const express = require('express');
const routes = require('./app/routes');
const db = require('./app/models');
const config = require('./config/config');

const app = express();

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});