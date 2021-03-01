const express = require("express");
const Note = require("../models/Note");
const Picture = require("../models/Picture");
const router = express.Router();
const fs = require('fs');


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

router.get('/pic/:id', async (req,res,next) => {
  try{
    const pics = await Picture.findOne({ _id: req.params.id });
    console.log({  data: pics.path})
    res.send({ data: pics });
  }catch (error){
    res.status(500).send('unable to find pics')
  }
})

router.post("/pic", fileUpload.single("image"),  (req, res, next) => {
  // using multer to upload file
  
  const pic = new Picture({ path: req.file.path });
   pic
    .save()
    .catch((err) => {
      res.send(err);
    });

 res.send(req.file.path);
});



module.exports = router;
