const { connetionDB } = require("./src/db/connetionDB");
const app = require("./src/app");

connetionDB().then(() => {
  app.listen(process.env.PORT || 8080, () => {
    console.log(`Port running: ${process.env.PORT}`);
  });
});
