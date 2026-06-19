const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Serve upload folders
app.use("/uploads-blouse", express.static("public/uploads-blouse"));
app.use("/uploads-front", express.static("public/uploads-front"));
app.use("/uploads-sleeves", express.static("public/uploads-sleeves"));
app.use("/uploads-tassels", express.static("public/uploads-tassels"));

// Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const category = req.body.category;

        let folder = "public/uploads-blouse";

        if (category === "front")
            folder = "public/uploads-front";

        else if (category === "sleeves")
            folder = "public/uploads-sleeves";

        else if (category === "tassels")
            folder = "public/uploads-tassels";

        cb(null, folder);
    },

    filename: function (req, file, cb) {

        const ext = path.extname(file.originalname);

        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Upload API
app.post("/upload", upload.single("image"), (req, res) => {

    res.json({
        success: true,
        filename: req.file.filename
    });

});

// Get images API
app.get("/images/:category", (req, res) => {

    let folder = "public/uploads-blouse";

    const category = req.params.category;

    if (category === "front")
        folder = "public/uploads-front";

    else if (category === "sleeves")
        folder = "public/uploads-sleeves";

    else if (category === "tassels")
        folder = "public/uploads-tassels";

    fs.readdir(folder, (err, files) => {

        if (err) {
            return res.json([]);
        }

        res.json(files);
    });

});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});