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
  let {id, name, address, email, dial_code, phone, manager_title, manager_name1, manager_name2, about, join_reason, social_media, social_frequency, major_event, bank_name, bank_accountname, bank_shortcode, bank_accountnumber} = req.body;

  try {
    let sql = sprintf("UPDATE %s SET name = $1, address = $2, email = $3, dial_code = $4, phone = $5, manager_title = $6, manager_name1 = $7, manager_name2 = $8, about = $9, join_reason = $10, social_media = $11, social_frequency = $12, major_event = $13, bank_name = $14, bank_accountname = $15, bank_shortcode = $16, bank_accountnumber = $17 WHERE id = $18", dbTblName.causes);

    await db.query(sql, [name, address, email, dial_code, phone, manager_title, manager_name1, manager_name2, about, join_reason, social_media, social_frequency, major_event, bank_name, bank_accountname, bank_shortcode, bank_accountnumber, id]);

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
        user: {id, name, address, email, dial_code, phone, manager_title, manager_name1, manager_name2, about, join_reason, social_media, social_frequency, major_event, bank_name, bank_accountname, bank_shortcode, bank_accountnumber, user_type: consts.auth.USER_TYPE.CAUSE},
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
