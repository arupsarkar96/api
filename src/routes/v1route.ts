import { Router } from "express";
import v1Account from "./account";
import v1Nearby from "./nearby";
import v1Upload from "./upload";
import v1Call from "./call";

const v1Route = Router();

v1Route.use('/account', v1Account)
v1Route.use('/nearby', v1Nearby)
v1Route.use('/upload', v1Upload)
v1Route.use('/call', v1Call)


export default v1Route;