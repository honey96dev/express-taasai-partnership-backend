import express from "express";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import dateformat from "dateformat";
import pgformat from "pg-format";
import {dbTblName, server, session} from "core/config";
import strings from "core/strings";
import tracer from "core/tracer";
import consts from "core/consts";
import helpers from "core/helpers";
import db from "core/db";
import {sprintf} from "sprintf-js";

const saveProc = async (req, res, nect) => {
  const lang = req.get(consts.lang) || consts.defaultLanguage;
  const langs = strings[lang];
  let {id, name, address, email} = req.body;

  try {
    let sql = sprintf("UPDATE %s SET name = $1, address = $2, email = $3 WHERE id = $4", dbTblName.merchants);

    await db.query(sql, [name, address, email, id]);

    const token = jwt.sign(
      {
        id,
        email,
        name,
      },
      session.secret
    );

    res.status(200).send({
      result: langs.success,
      message: langs.successfullySaved,
      data: {
        user: {id, name, address, email, user_type: consts.auth.USER_TYPE.MERCHANT},
        token,
      },
    });
  } catch (err) {
    helpers.handleErrorResponse(res, err, langs);
  }
}

const router = express.Router();

router.post("/save", saveProc);

export default router;
