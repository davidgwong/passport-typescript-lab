import express from "express";
import session, { SessionData } from "express-session";
const router = express.Router();
import { ensureAuthenticated, ensureAdmin } from "../middleware/checkAuth";

let allSessions: { sessionId: string; userId: number }[] = [];
const getAllSessions = (store: Express.SessionStore) =>
  new Promise<void>((resolve, reject) => {
    store?.all!(
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
          allSessions = [];
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

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", ensureAdmin, (req, res) => {
  getAllSessions(req.sessionStore).then(() => {
    res.render("admin", {
      user: req.user,
      allSessions: allSessions,
    });
  });
});

router.get("/revoke/:revokeId", ensureAdmin, (req, res) => {
  const revokeSession = new Promise<void>((resolve, reject) => {
    req.sessionStore.destroy(req.params.revokeId, (err: any) => {
      if (err) reject(err);
      resolve();
    });
  });
  revokeSession
    .then(() => {
      return getAllSessions(req.sessionStore);
    })
    .then(() => {
      res.redirect("/admin");
    });
});

export default router;
