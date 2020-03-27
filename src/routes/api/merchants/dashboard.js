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

const overallProc = async (req, res, nect) => {
  const lang = req.get(consts.lang) || consts.defaultLanguage;
  const langs = strings[lang];
  let {id} = req.body;

  try {
    let sql = sprintf("SELECT * FROM %s WHERE id = $1;", dbTblName.merchants);
    let {rows, rowCount} = await db.query(sql, [id]);

    res.status(200).send({
      result: langs.success,
      data: rows[0],
    });
  } catch (err) {
    helpers.handleErrorResponse(res, err, langs);
  }
}

const offersListProc = async (req, res, next) => {  
  const lang = req.get(consts.lang) || consts.defaultLanguage;
  const langs = strings[lang];
  let {id} = req.body;
  
  try {
    let sql = sprintf("SELECT * FROM %s O WHERE O.merchant_id = $1 ORDER BY open_time DESC;", dbTblName.offers);

    let {rows, rowCount} = await db.query(sql, [id]);

    res.status(200).send({
      result: langs.success,
      data: rows,
    });
  } catch (err) {
    helpers.handleErrorResponse(res, err, langs);
  }
}

const router = express.Router();

router.post("/overall", overallProc);
router.post("/offers-list", offersListProc);

export default router;
