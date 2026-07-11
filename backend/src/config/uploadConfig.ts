import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const folderZaPriloge = path.join(process.cwd(), "uploads", "prilozi");

if (!fs.existsSync(folderZaPriloge)) { 
    fs.mkdirSync(folderZaPriloge, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => { 
        cb(null, folderZaPriloge) 
    },
    filename: (_req, file, cb) => {
        const ekstenzija =  path.extname(file.originalname);
        const nazivFajla = `${Date.now()}-${crypto.randomUUID()}${ekstenzija}`;

        cb(null, nazivFajla);
    }
});

const dozvoljeniTipovi = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordpressingml.document"
];

export const uploadPriloga = multer({

    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req, file, cb) => {
        if (!dozvoljeniTipovi.includes(file.mimetype)) {
            return cb(new Error("Tip fajla nije dozvoljen."));
        }

        cb(null, true);
    }
});