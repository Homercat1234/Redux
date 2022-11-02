var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

const getUid = async () => {
  let uid = uuidv4();
  while (
    (await prisma.users.count({
      where: {
        uid: uid,
      },
    })) !== 0
  ) {
    uid = uuidv4();
  }
  return uid;
}

router.get("/account", async (req, res) => {
  let uid = await getUid();
  res.send(`<h3>${uid}</h3>`);
  res.end();
});

module.exports = router;
