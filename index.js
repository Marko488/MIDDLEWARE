import express from "express";
import { body, check, query, param, validationResult } from "express-validator";
import { connectToDatabase } from "./db.js";
import usersRouter from "./routes/korisnici.js";
const app = express();
app.use(express.json());

const req_logger = (req, res, next) => {
  let date = new Date().toLocaleString();
  let method = req.method;
  let url = req.originalUrl;
  console.log(`${date} : ${method} ${url}`);
  next();
};
app.use(req_logger);

const admin_logger = (req, res, next) => {
  console.log("Oprez, stigao zahtjev na rutu /admin!");
  next();
};
app.all("/admin", admin_logger);

const error_midd = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Greska na posluzitelju!" });
};
app.use(error_midd);

app.get("/admin", (req, res) => {
  res.status(200).json({ message: "Pantera samo jako!" });
});

app.get("/error", (req, res) => {
  throw new Error("Greska neka na bacckendu!");
});

app.use("/users", usersRouter);

app.get(
  "/hello",
  [check("ime").notEmpty().withMessage("Nedostaje query parametar!")],
  (req, res) => {
    let errors = validationResult(req);
    if (errors.isEmpty()) {
      return res.status(200).send("Hello, " + req.query.ime);
    }
    return res.status(400).json({ message: errors.array() });
  }
);

app.listen(3000, (error) => {
  if (error) {
    console.log("Greska u pokretanju posluzitelja! ", error.message);
  } else {
    console.log("Posluzitelj uspjesno pokrenut!");
  }
});
