const express = require("express");
const router = new express.Router();
const AlbumModel = require("./../model/Album");
const ArtistModel = require("./../model/Artist");
const LabelModel = require("./../model/Label");
const uploader = require("./../config/cloudinary");

// router.use(protectAdminRoute);

// GET - all albums
router.get("/", async (req, res, next) => {
  try {
    res.render("dashboard/albums", {
      albums: await AlbumModel.find().populate("artist label"),
    });
  } catch (err) {
    next(err);
  }
});

// GET - create one album (form)
router.get("/create", async (req, res, next) => {
  try{
    const artists = await ArtistModel.find();
    const labels = await LabelModel.find();
    res.render("dashboard/albumCreate", { artists, labels });
    
  }catch (err) {
    next(err);
  }
});

// GET - update one album (form)
router.get("/update/:id", async (req,res,next) => {
try{
  const artists = await ArtistModel.find();
  const labels = await LabelModel.find();

  AlbumModel.findById(req.params.id).populate("label").populate("artist")
  .then((album) => {
    console.log(album)
    res.render("dashboard/albumUpdate" ,{ artists, album , labels })
  }) 
}catch (err) {
  next(err);
}
})

// GET - delete one album
router.get("/delete/:id" , (req, res, next) => {
  AlbumModel.findByIdAndDelete(req.params.id)
  .then(() => res.redirect("/dashboard/album"))
  .catch(next)
})
// POST - create one album
router.post("/", uploader.single("cover"), async (req, res, next) => {
  const newAlbum = { ...req.body };
  if (!req.file) newAlbum.cover = undefined;
  else newAlbum.cover = req.file.path;
  console.log(newAlbum);
  try {
    await AlbumModel.create(newAlbum);
    res.redirect("/dashboard/album");
  } catch (err) {
    next(err);
  }
});

// POST - update one album

module.exports = router;
