import express from "express";
import {
  addAuthority,
  getAllAuthorities,
  updateAuthority,
  deleteAuthority,
  uploadAuthorityPhoto
} from "../controllers/authorityController.js";

const router = express.Router();

router.post("/", uploadAuthorityPhoto, addAuthority);
router.get("/", getAllAuthorities);
router.put("/:id", updateAuthority);
router.delete("/:email", deleteAuthority);

export default router;
