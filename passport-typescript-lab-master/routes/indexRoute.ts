import express from "express";
import session, { SessionData } from "express-session";
const router = express.Router();
import { ensureAuthenticated, ensureAdmin } from "../middleware/checkAuth";

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", ensureAdmin, (req, res) => {
  let allSessions: { sessionId: string; userId: number }[] = [];
  const getAllSessions = new Promise<void>((resolve, reject) => {
    req.sessionStore?.all!(
      (
        err: any,
        sessions:
          | SessionData[]
          | {
              [sid: string]: SessionData;
            }
          | null
          | undefined
      ) => {
        if (err) reject(err);
        if (
          sessions &&
          typeof sessions === "object" &&
          !Array.isArray(sessions)
        ) {
          const sessionIds = Object.keys(sessions);
          sessionIds.forEach((sessionId) => {
            allSessions.push({
              sessionId: sessionId,
              userId: sessions[sessionId].passport.user,
            });
          });
        }
        resolve();
      }
    );
  });

  getAllSessions.then(() => {
    res.render("admin", {
      user: req.user,
      allSessions: allSessions,
    });
  });  
});

export default router;
