import express from "express";
import passport from "passport";
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

declare module "express-session" {
  interface SessionData {
    messages: string[];
  }
}

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

export default router;
