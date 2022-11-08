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

// Returns the number of users based on an email or an email and a name.
const getUserCount = async (name = null, email) => {
  // If the name is provided
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
    // If the name is not provided
  } else {
    const user = await prisma.users.findMany({
      where: {
        email,
      },
    });
    return user.length;
  }
};

// A method that generates a new uuid
const generateUid = async () => {
  let uid = uuidv4();

  // If the uid already exists in the database regenerate
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

// A method that creates a session
const getSession = async (uid, uidHash = null, expires = null) => {
  // A method that checks to see if the hash is in the database
  const checkHash = async (uidHash) => {
    return await prisma.sessions.count({
      where: {
        hash: uidHash,
      },
    });
  };

  // Checks to see if the user is in the db
  const checkUid = async (uid) => {
    return await prisma.sessions.count({
      where: {
        uid,
      },
    });
  };

  // A method that inserts the session
  const insertSession = async (uidHash, expires) => {
    // If a session already exists in the database
    if ((await checkUid(uid)) > 0) {
      await prisma.sessions.update({
        where: {
          uid,
        },
        data: {
          hash: uidHash,
          expires,
        },
      });
      // If a session does not exist in the database
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
  // If the uid hash provided
  if (uidHash != null) {
    // Check if the hash is database
    if ((await checkHash(uidHash)) > 0) {
      // Check if the hash is valid
      if (await compare(uid, uidHash)) {
        // Generate a new hash
        const salt = await genSalt(10);
        const oldHash = uidHash;
        uidHash = await hash(uid, salt);

        // Make sure the hash is not in the database
        while ((await checkHash(uidHash)) > 0) {
          salt = await genSalt(10);
          uidHash = await hash(uid, salt);
        }

        // Generate an expiration
        let date = new Date(Date.now());
        date.setDate(date.getDate() + 1);
        // If the expires is not null update expires with the new date
        if (expires != null) date = expires;

        // Insert the seession
        await insertSession(uidHash, date, oldHash);
        return { result: true, uidHash, expires: date };
      }
      // If the hash is invalid
      return { result: false };
      // If the hash is not in the database
    } else {
      // The input must be invalid
      return { result: false };
    }
    // If the uidHash is not provided
  } else {
    // Generate a new hash
    let salt = await genSalt(10);
    uidHash = await hash(uid, salt);

    // Make sure the hash is not in the database
    while ((await checkHash(uidHash)) > 0) {
      salt = await genSalt(10);
      uidHash = await hash(uid, salt);
    }

    // Generate an expiration
    let date = new Date(Date.now());
    date.setDate(date.getDate() + 1);
    // If the expires is not null update expires with the new date
    if (expires != null) date = expires;

    // Insert the seession
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

  if ((await getUserCount(name, email)) > 0)
    return res.status(400).send({ message: "Invalid username or email" });

  let uid = await generateUid();

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
  const session = await getSession(uid, null, date);
  if (session.result === false)
    return res.status(400).json({ message: "Failed to create session" });

  res
    .status(202)
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

  if ((await getUserCount(email)) != 0)
    return res.status(400).send({ message: "Invalid username or email" });

  const user = await prisma.users.findUnique({ where: { email: email } });

  if (user) {
    const validPassword = await compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid Password" });
  } else {
    return res.status(401).json({ message: "User does not exist" });
  }

  const uid = user.uid;

  let date = new Date(Date.now());
  date.setDate(date.getDate() + sessionLength);

  const session = await getSession(uid, null, date);
  if (session.result === false)
    return res.status(400).json({ message: "Failed to create session" });

  res
    .status(202)
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

  const { uid, hash } = session;

  if (
    (await prisma.sessions.count({
      where: {
        uid,
        hash,
      },
    })) === 0
  )
    return res.status(400).json({ message: "Session not found" });

  await prisma.sessions.deleteMany({
    where: {
      uid,
      hash,
    },
  });

  return res.status(202).json({ message: "Sesson deleted" });
});

router.post("/verify", async (req, res) => {
  session = JSON.parse(req.headers["session"]);
  if (session.uid == null || session.expires == null || session.hash == null)
    return res
      .status(400)
      .json({ message: "A required parameter was null", result: false });
  if (session.uid == "" || session.expires == "" || session.hash == "")
    return res
      .status(400)
      .json({ message: "A required parameter was not found", result: false });

  const { uid, hash, expires } = session;
  const find = await prisma.sessions.findUnique({
    where: {
      uid,
    },
  });
  if (!find)
    return res
      .status(400)
      .json({ message: "Session not found", result: false });
  if (find.hash !== hash)
    return res
      .status(400)
      .json({ message: "Session not found", result: false });

  let dateCompare = find.expires;
  dateCompare.setDate(dateCompare.getMinutes() + 1);
  if (expires > dateCompare)
    return res.status(400).json({ message: "Session expired", result: false });

  return res.status(202).json({ message: "Verifed", result: true });
});

module.exports = router;
