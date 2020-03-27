import express from "express";
import expressJwt from "express-jwt";
import {session} from "core/config";

import authRouter from "./merchants/auth";
import dashboardRouter from "./merchants/dashboard";
import informationRouter from "./merchants/information";

const router = express.Router();

// router.use("/", expressJwt({secret: session.secret})
//   .unless({
//     path: [
//       /\/auth\/*/,
//     ]
//   }));

router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/information", informationRouter);

export default router;
