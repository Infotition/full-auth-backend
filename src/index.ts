//* --------------- SERVER DEPENDENCIES --------------- *\\

import express from 'express';

//* -------------- SERVER CONFIGURATION --------------- *\\

require('dotenv').config({
  path: './config/index.env',
});

const PORT = process.env.PORT || 3000;

const app = express();

//* ------------------- MIDDLEWARES ------------------- *\\

app.use(express.json());

//* --------------- DATABASE CONNECTION --------------- *\\

//* --------------------- ROUTES ---------------------- *\\

//* Homepage route
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Home page',
  });
});

//* Default route - Page not found
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page not found',
  });
});

//* ------------------ START SERVER ------------------- *\\

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
