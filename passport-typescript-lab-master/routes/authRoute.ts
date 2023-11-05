import express from "express";
import passport from "passport";
import {
  forwardAuthenticated,
  ensureAuthenticated,
} from "../middleware/checkAuth";

declare global {
  namespace Express {
    export interface User {
      id: number;
      name: string;
      email: string;
      password: string;
      role: string;
    }
  }
}

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const messages = req.session.messages || [];
  res.render("login", { messages: messages.pop() });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    /* FIX ME: 😭 Done 😀 failureMsg needed when login fails */
    failureMessage: true,
  }),
  function(req, res) {
    if(req.user?.role == "Admin") res.redirect("/admin");
    else res.redirect("/dashboard");
  }
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

export default router;
