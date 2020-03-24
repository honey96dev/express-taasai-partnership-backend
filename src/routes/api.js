import express from "express";
import expressJwt from "express-jwt";
import {session} from "core/config";

import authRouter from "./api/auth";
import causesRouter from "./api/causes";
import footersRouter from "./api/footers";

const router = express.Router();

// router.use("/", expressJwt({secret: session.secret})
//   .unless({
//     path: [
//       /\/auth\/*/,
//     ]
//   }));

router.use("/auth", authRouter);
router.use("/causes", causesRouter);
router.use("/footers", footersRouter);

export default router;
