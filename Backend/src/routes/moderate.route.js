const express = require("express");
const { asyncFuncHandler } = require("../utils/asyncFuncHandler.util");
const { signup, signin } = require("../controller/moderator.controller");

const router = express.Router();

router.post("/api/signup", asyncFuncHandler(signup));
router.post("/api/signin", asyncFuncHandler(signin));

module.exports = router;
