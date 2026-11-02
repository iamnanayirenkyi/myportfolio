import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import admin from "firebase-admin";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const contentFile = path.join(here, "data", "content.json");
const uploadsFolder = path.join(here, "uploads");
const builtSiteFolder = path.join(here, "..", "client", "dist");
const port = process.env.PORT || 5000;

fs.mkdirSync(uploadsFolder, { recursive: true });

/* ---------- Firebase Admin: used only to verify who is calling ---------- */

function startFirebaseAdmin() {
  try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      serviceAccount = JSON.parse(
        fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8"),
      );
    }
    if (!serviceAccount) return false;
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    return true;
  } catch (problem) {
    console.error("Firebase Admin could not start:", problem.message);
    return false;
  }
}

const firebaseIsReady = startFirebaseAdmin();
const allowedAdminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

async function onlyTheOwner(req, res, next) {
  if (!firebaseIsReady) {
    return res
      .status(503)
      .json({ message: "Firebase Admin is not configured on the server yet." });
  }
  if (allowedAdminEmails.length === 0) {
    return res
      .status(403)
      .json({
        message:
          "No admin email has been allowed. Set ADMIN_EMAILS in server/.env.",
      });
  }
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Please sign in first." });

  try {
    const verified = await admin.auth().verifyIdToken(token);
    const email = (verified.email || "").toLowerCase();
    if (!allowedAdminEmails.includes(email)) {
      return res
        .status(403)
        .json({ message: "This account is not allowed to edit the site." });
    }
    req.signedInOwner = verified;
    next();
  } catch {
    res
      .status(401)
      .json({ message: "Your sign-in has expired. Please sign in again." });
  }
}

/* ---------- File uploads (profile picture and CV) ---------- */

const acceptedKinds = {
  photo: {
    mimes: ["image/jpeg", "image/png", "image/webp"],
    prefix: "profile-photo",
  },
  cv: {
    mimes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    prefix: "cv",
  },
};

const fileCatcher = multer({
  storage: multer.diskStorage({
    destination: uploadsFolder,
    filename: (req, file, done) => {
      const kind = acceptedKinds[req.params.kind];
      const extension = path
        .extname(file.originalname)
        .toLowerCase()
        .replace(/[^.a-z0-9]/g, "");
      done(null, `${kind.prefix}-${Date.now()}${extension}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, done) => {
    const kind = acceptedKinds[req.params.kind];
    if (!kind) return done(new Error("Unknown upload type."));
    if (!kind.mimes.includes(file.mimetype))
      return done(new Error("That file type is not accepted."));
    done(null, true);
  },
});

/* ---------- App ---------- */

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadsFolder));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    adminReady: firebaseIsReady && allowedAdminEmails.length > 0,
  });
});

app.get("/api/content", (req, res) => {
  try {
    res.json(JSON.parse(fs.readFileSync(contentFile, "utf8")));
  } catch {
    res.status(500).json({ message: "The page content could not be read." });
  }
});

const requiredSections = [
  "profile",
  "skills",
  "performanceStages",
  "videos",
  "pastWorks",
  "upcomingWorks",
  "mentoring",
  "socials",
];

app.put("/api/content", onlyTheOwner, (req, res) => {
  const incoming = req.body;
  const looksRight =
    incoming &&
    typeof incoming === "object" &&
    requiredSections.every((section) => section in incoming);
  if (!looksRight) {
    return res
      .status(400)
      .json({ message: "The content is missing some sections." });
  }
  const temporaryFile = `${contentFile}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(incoming, null, 2));
  fs.renameSync(temporaryFile, contentFile);
  res.json({ saved: true });
});

app.post("/api/upload/:kind", onlyTheOwner, (req, res) => {
  if (!acceptedKinds[req.params.kind]) {
    return res.status(400).json({ message: "Unknown upload type." });
  }
  fileCatcher.single("file")(req, res, (problem) => {
    if (problem) return res.status(400).json({ message: problem.message });
    if (!req.file)
      return res.status(400).json({ message: "No file was sent." });
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

if (fs.existsSync(builtSiteFolder)) {
  app.use(express.static(builtSiteFolder));
  app.get("*", (req, res) =>
    res.sendFile(path.join(builtSiteFolder, "index.html")),
  );
}

app.listen(port, () => {
  console.log(`Portfolio server listening on http://localhost:${port}`);
  if (!firebaseIsReady)
    console.log(
      "Note: admin saving is off until Firebase Admin credentials are added.",
    );
});
