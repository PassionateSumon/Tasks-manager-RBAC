const mongoose = require("mongoose");

exports.connetionDB = async () => {
  const dbConnect = await mongoose.connect(process.env.MONGO_URI);
  console.log(`connection: ${dbConnect.connection.host}`);
};
