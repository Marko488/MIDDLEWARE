import express from "express";
import { body, query, param, validationResult, check } from "express-validator";
import { connectToDatabase } from "../db.js";
import { ObjectId } from "mongodb";
import {
  Validacija_emaila,
  Pretraga_korisnika,
} from "../Middleware/middleware.js";

const router = express.Router();
let db = await connectToDatabase();

router.get("/", async (req, res) => {
  let users_coll = db.collection("users");

  let all_users = await users_coll.find().toArray();
  if (all_users) {
    res.status(200).json(all_users);
  } else {
    res.status(404).json({ message: "Nema korisnika!" });
  }
});

router.get("/:id", [Pretraga_korisnika], async (req, res) => {
  res.status(200).json(req.korisnik);
});

router.patch(
  "/:id",
  [
    Pretraga_korisnika,
    body("email")
      .isEmail()
      .withMessage("Molimo unesite ispravnu strukturu Email adrese!"),
  ],
  async (req, res) => {
    let errors = validationResult(req);

    // Prvo provjeravamo da li postoje greške u validaciji
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let users_coll = db.collection("users");
      let id_param = req.params.id;
      let novi_email = req.body.email;

      let response = await users_coll.updateOne(
        { _id: new ObjectId(id_param) },
        { $set: { email: novi_email } }
      );

      res.status(200).json({ message: response.modifiedCount });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/register",
  [
    check("ime")
      .isAlpha()
      .withMessage("Ime mora biti sacinjeno samo od slova!"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password mora sadrzavati bar 6 znakova!"),
    check("confirm_passord").custom((value, { req }) => {
      return value == req.body.password;
    }),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    let users_coll = db.collection("users");
    try {
      let response = await users_coll.insertOne({
        ime: req.body.ime,
        password: req.body.password,
        confirm_password: req.body.confirm_passord,
      });
      res.status(200).send("Registracija uspjesna!");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

export default router;
