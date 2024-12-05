const { connetionDB } = require("./src/db/connetionDB");
const app = require("./src/app");

connetionDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Port running: ${process.env.PORT}`);
  });
});
