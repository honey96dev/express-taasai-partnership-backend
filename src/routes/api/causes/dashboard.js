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
    let sql = sprintf("SELECT COUNT(*) count FROM %s WHERE cause_id = $1;", dbTblName.passengers);

    let result = await db.query(sql, [id]);
    const contributors = result.rows[0]["count"];

    sql = sprintf("SELECT SUM(rounded_fare - total_fare) sum FROM %s WHERE cause_id = $1;", dbTblName.rides);

    result = await db.query(sql, [id]);
    const total = result.rows[0]["sum"];

    sql = sprintf("SELECT * FROM %s WHERE id = $1;", dbTblName.causes);

    result = await db.query(sql, [id]);
    const balance = result.rows[0]["balance"];


    res.status(200).send({
      result: langs.success,
      data: {
        contributors,
        total,
        balance,
        withdrawn: 0,
      },
    });
  } catch (err) {
    helpers.handleErrorResponse(res, err, langs);
  }
}

const donateListProc = async (req, res, next) => {  
  const lang = req.get(consts.lang) || consts.defaultLanguage;
  const langs = strings[lang];
  let {id} = req.body;
  
  try {
    let sql = sprintf("SELECT R.*, P.name contributor FROM %s R INNER JOIN %s P ON P.id = R.passenger_id AND R.cause_id = $1 AND R.ride_status = $2;", dbTblName.rides, dbTblName.passengers);

    let {rows, rowCount} = await db.query(sql, [id, 4]);

    res.status(200).send({
      result: langs.success,
      data: rows,
    });
  } catch (err) {
    helpers.handleErrorResponse(res, err, langs);
  }
}

const withdrawListProc = async (req, res, next) => {  
  const lang = req.get(consts.lang) || consts.defaultLanguage;
  const langs = strings[lang];
  let {id} = req.body;
  
  try {
    let sql = sprintf("SELECT R.*, P.name contributor FROM %s R INNER JOIN %s P ON P.id = R.passenger_id AND R.cause_id = $1 AND R.ride_status = $2;", dbTblName.rides, dbTblName.passengers);

    let {rows, rowCount} = await db.query(sql, [id, 4]);

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
router.post("/donate-list", donateListProc);
router.post("/withdraw-list", withdrawListProc);

export default router;
