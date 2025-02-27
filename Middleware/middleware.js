import express from "express";
import { connectToDatabase } from "../db.js";
import { ObjectId } from "mongodb";
let db = await connectToDatabase();

const Validacija_emaila = (req, res, next) => {
  if (req.body.email && typeof req.body.email == "string") {
    next();
  } else {
    return res
      .status(400)
      .json({ message: "Neispravna struktura tijela zahtjeva!" });
  }
};

const Pretraga_korisnika = async (req, res, next) => {
  let id_korisnik = req.params.id;
  let users_coll = db.collection("users");
  try {
    let korisnik = await users_coll.findOne({ _id: new ObjectId(id_korisnik) });
    req.korisnik = korisnik;
    return next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { Validacija_emaila, Pretraga_korisnika };
