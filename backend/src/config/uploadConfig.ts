import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const folderZaPriloge = path.join(process.cwd(), "uploads", "prilozi");

if (!fs.existsSync(folderZaPriloge)) { 
    fs.mkdirSync(folderZaPriloge, { recursive: true });
}

const ekstenzijePoTipu: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
    "text/plain": ".txt",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx"
};

const dozvoljeniTipovi = Object.keys(ekstenzijePoTipu);

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => { 
        cb(null, folderZaPriloge);
    },
    filename: (_req, file, cb) => {
        const ekstenzija = ekstenzijePoTipu[file.mimetype];

        if (!ekstenzija) {
            return cb(new Error("Tip fajla nije dozvoljen."), "");
        }

        const nazivFajla = `${Date.now()}-${crypto.randomUUID()}${ekstenzija}`;
        cb(null, nazivFajla);
    }
});

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