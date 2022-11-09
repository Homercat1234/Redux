const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const router = express.Router();
router.use(cookieParser());
router.use(express.json());
router.use(cors());

const prisma = new PrismaClient();

const verify = async (session) => {
  session = JSON.parse(session);
  if (session.uid == null || session.expires == null || session.hash == null)
    return {
      status: "400",
      message: "A required parameter was null",
      result: false,
    };
  if (session.uid == "" || session.expires == "" || session.hash == "")
    return {
      status: "400",
      message: "A required parameter was not found",
      result: false,
    };

  const { uid, hash, expires } = session;
  const find = await prisma.sessions.findUnique({
    where: {
      uid,
    },
  });
  if (!find)
    return { status: "400", message: "Session not found", result: false };
  if (find.hash !== hash)
    return { status: "400", message: "Session not found", result: false };

  let dateCompare = find.expires;
  dateCompare.setDate(dateCompare.getMinutes() + 1);
  if (expires > dateCompare)
    return { status: "400", message: "Session expired", result: false };

  return { status: "202", message: "Session verifed", result: true };
};

router.post("/post", async (req, res) => {
  const verifed = await verify(req.headers["session"]);
  if (verifed.result === false)
    res
      .status(parseInt(verifed.status))
      .json({ messege: verifed.message, result: false });
  const uid = JSON.parse(req.headers["session"]).uid;
  const { title, post } = req.body;
  await prisma.posts.create({
    data: {
      uid,
      title,
      post,
    },
  });
});

router.get("/post", async (req, res) => {
    const posts = await prisma.posts.findMany();
    res.status(202).json(posts);
});

router.get("/name", async (req, res) => {
  const {uid} = req.headers;
  const name = await prisma.users.findMany({where: {uid}});
  res.status(200).send(name[0].name);
});

module.exports = router;