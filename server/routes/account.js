const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const { genSalt, hash, compare } = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const router = express.Router();
router.use(cookieParser());
router.use(express.json());
router.use(cors());

const prisma = new PrismaClient();

const findUsers = async (name = null, email) => {
  if (name != null) {
    const user = await prisma.users.findMany({
      where: {
        OR: [
          {
            email,
            name,
          },
        ],
      },
    });
    return user.length;
  } else {
    const user = await prisma.users.findMany({
      where: {
        email,
      },
    });
    return user.length;
  }
};

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
};

const getSession = async (uid, uidHash = null, expires = null) => {
  const checkSessions = async (uidHash) => {
    await prisma.sessions.count({
      where: {
        uid: uidHash,
      },
    });
  };

  const insertSession = async (uidHash, expires, oldHash = null) => {
    if (oldHash != null) {
      await prisma.sessions.update({
        where: {
          uid: uid,
        },
        data: {
          update: {
            where: {
              hash: oldHash,
            },
            data: {
              hash: uidHash,
              expires,
            },
          },
        },
      });
    } else {
      await prisma.sessions.create({
        data: {
          uid,
          hash: uidHash,
          expires,
        },
      });
    }
  };

  if (uidHash == null) {
    if ((await checkSessions(uidHash)) !== 0) {
      const isValid = await compare(uid, uidHash);
      if (isValid) {
        const salt = await genSalt(10);
        const oldHash = uidHash;
        uidHash = await hash(uid, salt);

        while ((await checkSessions(uidHash)) > 0) {
          salt = await genSalt(10);
          uidHash = await hash(uid, salt);
        }

        let date = new Date(Date.now());
        date.setDate(date.getDate() + 1);
        if (expires != null) date.setDate(date.getDate() + expires - 1);

        await insertSession(uidHash, date, oldHash);
        return { result: true, uidHash, expires: date };
      }
      return { result: false };
    } else {
      return { result: false };
    }
  } else {
    let salt = await genSalt(10);
    uidHash = await hash(uid, salt);

    while ((await checkSessions(uidHash)) > 0) {
      salt = await genSalt(10);
      uidHash = await hash(uid, salt);
    }

    let date = new Date(Date.now());
    date.setDate(date.getDate() + 1);
    if (expires != null) date.setDate(date.getDate() + expires - 1);

    await insertSession(uidHash, date);
    return { result: true, uidHash, expires: date };
  }
};

router.post("/register", async (req, res) => {
  let { name, password, email } = req.body;

  if (name == null || password == null || email == null)
    return res.status(400).json({ message: "A required parameter was null" });
  if (name == "" || password == "" || email == "")
    return res
      .status(400)
      .json({ message: "A required parameter was not found" });

  if ((await findUsers(name, email)) > 0)
    return res.status(400).send({ message: "Invalid username or email" });

  let uid = await getUid();

  const salt = await genSalt(10);
  password = await hash(password, salt);

  await prisma.users.create({
    data: {
      uid,
      name,
      email,
      password,
    },
  });

  let date = new Date(Date.now());
  date.setDate(date.getDate() + 1);

  const session = await getSession(uid, (expires = date));
  if (session.result === false)
    return res.status(400).json({ message: "Failed to create session" });

  res
    .status(200)
    .cookie("session")
    .send({ uid, expires: date, hash: session.uidHash });
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let sessionLength = 1;

  if (!(req.body.expires == null || req.body.expires == ""))
    sessionLength = req.body.expires;

  if (email == null || password == null)
    return res.status(400).json({ message: "A required parameter was null" });
  if (email == "" || password == "")
    return res
      .status(400)
      .json({ message: "A required parameter was not found" });

  if ((await findUsers(email)) != 0)
    return res.status(400).send({ message: "Invalid username or email" });

  const user = await prisma.users.findUnique({ where: { email: email } });

  if (user) {
    const validPassword = await compare(body.password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid Password" });
  } else {
    return res.status(401).json({ message: "User does not exist" });
  }

  let date = new Date(Date.now());
  date.setDate(date.getDate() + sessionLength);

  const session = await getSession(uid, (expires = date));
  if (session.result === false)
    return res.status(400).json({ message: "Failed to create session" });

  res
    .status(200)
    .cookie("session")
    .send({ uid, expires: date, hash: session.uidHash });
});

router.post("/logout", async (req, res) => {
  session = JSON.parse(req.headers["session"]);
  if (session.uid == null || session.expires == null || session.hash == null)
    return res.status(400).json({ message: "A required parameter was null" });
  if (session.uid == "" || session.expires == "" || session.hash == "")
    return res
      .status(400)
      .json({ message: "A required parameter was not found" });
    
  const { uid, hash, expires } = session;

  
});

module.exports = router;
