import express from "express";
import expressJwt from "express-jwt";
import {session} from "core/config";

import authRouter from "./causes/auth";
import informationRouter from "./causes/information";

const router = express.Router();

// router.use("/", expressJwt({secret: session.secret})
//   .unless({
//     path: [
//       /\/auth\/*/,
//     ]
//   }));

router.use("/auth", authRouter);
router.use("/information", informationRouter);

export default router;
