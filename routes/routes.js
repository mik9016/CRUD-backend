const express = require("express");
const Note = require("../models/Note");
const Picture = require("../models/Picture");
const Pure = require("../models/Pure");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const fileUpload = require("../file-upload"); //multer upload file

//JSON CRUD OPERATIONS

router.get("/get", async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.send({ data: notes });
  } catch (error) {
    res.status(500).send("unable to connect to database");
  }
});

router.post("/post", (req, res, next) => {
  const myData = new Note({
    imie: req.body.imie,
    nazwisko: req.body.nazwisko,
  });
  myData
    .save()
    .then((item) => {
      res.send(`${item} saved to database`);
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});

router.delete("/post/:id", async (req, res, next) => {
  try {
    await Note.deleteOne({ _id: req.params.id }); //podawać zawsze w url _idnumer
    res.send("post removed ");
  } catch (error) {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

router.patch("/post/:id", async (req, res, next) => {
  const note = await Note.findOne({ _id: req.params.id });

  if (req.body.imie) {
    note.imie = req.body.imie;
  }

  if (req.body.nazwisko) {
    note.nazwisko = req.body.nazwisko;
  }
  try {
    await note.save();
    res.send(note);
  } catch (error) {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

// PICTURE CRUD OPERATIONS

router.get("/pic/:id", async (req, res, next) => {
  try {
    const pic = await Picture.findOne({ _id: req.params.id });

    res.sendFile(path.join(__dirname + "/../uploads/" + pic.name)); // /../ znaczy jeden level wyżej w hierarchii folderów
  } catch (error) {
    res.status(500).send("unable to find pic");
  }
});

router.post("/pic", fileUpload.single("image"), (req, res, next) => {
  // using multer to upload file

  const pic = new Picture({
    date: new Date(),
    name: req.file.filename,
    path: req.file.path,
  });
  pic.save().catch((err) => {
    res.send(err);
  });

  res.send(pic);
});

router.delete("/pic/:id", async (req, res, next) => {
  try {
    const pic = await Picture.findOne({ _id: req.params.id });

    setTimeout(() => {
      fs.unlink(path.join(__dirname + "/../uploads/" + pic.name), () => {
        console.log("file removed");
      });
    }, 1000);

    await Picture.deleteOne({ _id: req.params.id }); //podawać zawsze w url _idnumer

    res.send("post removed ");
  } catch (error) {
    res.status(404);
    res.send({ error: "Pic doesn't exist!" });
  }
});

router.patch("/pic/:id", fileUpload.single("image"), async (req, res, next) => {
  const pic = await Picture.findOne({ _id: req.params.id });
  console.log(req.body.name);
  if (req.body.name) {
    setTimeout(() => {
      fs.unlink(path.join(__dirname + "/../uploads/" + pic.name), () => {
        console.log("file removed");
      });
    }, 1000);
    pic.path = req.file.path;
    pic.date = new Date();
    pic.name = req.file.filename;
  }

  try {
    await pic.save();
    res.send(pic);
  } catch (error) {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

// Storing pure IMG in DB
const imgPath = path.join(__dirname + "/../uploads/" + '6ad87d75-d3dc-448e-9a17-4b185322b1f7.png');

router.post("/pure", fileUpload.single("image"), (req, res, next) => {

  const pure = new Pure();
  res.send(pure)
  pure.img.data = fs.readFileSync(imgPath);
  pure.img.contentType = 'image/png';

  pure.save().catch((err) => {
    res.send(err);
  });
});

module.exports = router;
