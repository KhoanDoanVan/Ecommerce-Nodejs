const app = require('./src/app.js');

const PORT = process.env.PORT || 3000;

const server = app.listen( PORT, () => {
  console.log(`Server start with PORT::${PORT} !!!`);
})


process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Server Express`));
})