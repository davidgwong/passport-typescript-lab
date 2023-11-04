import express from "express";
import session, { SessionData } from "express-session";
import passport from "passport";
import {
  forwardAuthenticated,
  ensureAuthenticated,
} from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const messages = req.session.messages || [];
  res.render("login", { messages: messages.pop() });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    /* FIX ME: 😭 Done 😀 failureMsg needed when login fails */
    failureMessage: true,
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/login",
    failureMessage: true,
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

router.get("/admin", ensureAuthenticated, (req, res) => {
  let allSessions:
    | SessionData[]
    | { [sid: string]: SessionData }
    | null
    | undefined = null;
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
        allSessions = sessions;
        resolve();
      }
    );
  });

  getAllSessions.then(() => console.log(allSessions));

  res.render("admin", {
    user: req.user,
  });
});

export default router;
