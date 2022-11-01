var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
   
router.get('/account', function (req, res) {
    console.log("Router Working");
    res.end();
})

module.exports = router;