const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const Image = require('./model')
require("./db/db");
const port = process.env.PORT || 8000;
const app = express();
const multer = require("multer");
const MulterSharpResizer = require("multer-sharp-resizer");



app.use(express.static(`${__dirname}/public`));
app.use(express.json());

const multerStorage = multer.memoryStorage();

//Filter files with multer
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})
// const resizeImagesGalleryFunc = async (req, res) => {
//     try {
//       const today = new Date();
//       const year = today.getFullYear();
//       const month = `${today.getMonth() + 1}`.padStart(2, "0");
//       const filename = `gallery-${Date.now()}`;
//       const sizes = [
//         {
//           path: "original",
//           width: null,
//           height: null,
//         },
//         {
//           path: "large",
//           width: 800,
//           height: 800,
//         },
//         {
//           path: "medium",
//           width: 300,
//           height: 300,
//         },
//         {
//           path: "thumbnail",
//           width: 100,
//           height: 100,
//         },
//       ];
  

//       const uploadPath = `./public/uploads/${year}/${month}`;
//       const fileUrl = `${req.protocol}://${req.get(
//         "host"
//       )}/uploads/${year}/${month}`;
//       // sharp options
//       const sharpOptions = {
//         fit: "contain",
//         background: { r: 255, g: 255, b: 255 },
//       };
//       // create a new instance of MulterSharpResizer and pass params
//       const resizeObj = new MulterSharpResizer(
//         req,
//         filename,
//         sizes,
//         uploadPath,
//         fileUrl,
//         sharpOptions
//       );
//       // call resize method for resizing files
//       resizeObj.resize();
//       // get details of uploaded files
//       const images = resizeObj.getData();
//       res.status(200).json({
//         status: "success",
//         data: {
//           gallery: images,
//         },
//       });
//     } catch (err) {
//       console.log(err);
//     } 
    
    const uploadProductImages = upload.fields([
        { name: "cover", maxCount: 1 },
        // { name: "gallery", maxCount: 1 },
      ]);
     
      const resizerImages = async (req, res, next) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = `${today.getMonth() + 1}`.padStart(2, "0");
        const filename = {
          cover: `cover-${Date.now()}`,
          // gallery: `gallery-${Date.now()}`,
        };
        const sizes = [
          {
            path: "original",
            width: null,
            height: null,
          },
        
          {
            path: "thumbnail",
            width: 100,
            height: 250,
          },
        ];
        const uploadPath = `./public/uploads/${year}/${month}`;
        const fileUrl = `${req.protocol}://${req.get(
          "host"
        )}/uploads/${year}/${month}`;
   
        const sharpOptions = {
          fit: "contain",
          background: { r: 255, g: 255, b: 255 },
        };
        // create a new instance of MulterSharpResizer and pass params
        const resizeObj = new MulterSharpResizer(
          req,
          filename,
          sizes,
          uploadPath,
          fileUrl,
          sharpOptions
        );
//  console.log(resizeObj)
        await resizeObj.resize();
        const getDataUploaded = resizeObj.getData();
        // console.log(getDataUploaded)
        // const createdImage =  await getDataUploaded.save();
        req.body.cover = getDataUploaded.cover;
        // req.body.gallery = getDataUploaded.gallery;
        next();
      };

      
   const createProduct = async (req, res, next) => {

    const cover =  req.body.cover; 
    const image = new Image({cover,});
       const createdImage = await image.save();

    res.status(201).json({
      status: "success",
      cover: createdImage._doc
    });
  
  };
  // const createProduct = async (req, res, next) => {

  //   const cover =  req.body.cover; 
  //   const image = new Image({cover});
  //      const createdImage = await image.save();
  //    console.log(createdImage.cover[0]);
  //   res.status(201).json(
     
    
  //     // cover: req.body.cover,
  //     createdImage.cover[0]

  //   //   gallery: req.body.gallery,
  //   );
  
  // };

const getImage = async(req,res)=>{
  const images = await Image.find();
  res.status(200).json({images})

}

app.use(cors())
// app.post("/images", upload.array("galleries", 4), resizeImagesGalleryFunc);
app.post("/images", uploadProductImages, resizerImages,createProduct);
app.get("/images", getImage);


app.listen(port, () => console.log(`CONNECTION IS SETUP AT ${port}`));
