import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../../controllers/userController";
import { PassportStrategy } from "../../interfaces/index";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    try {
      const user = getUserByEmailIdAndPassword(email, password);

      return user
        ? done(null, user)
        : done(null, false, {
            message: "Password is incorrect",
          });
    } catch (err) {
      return done(null, false, {
        message: "Couldn't find user with email: " + email,
      });
    }
  }
);

/*
FIX ME (types) 😭 Done 😀
*/
passport.serializeUser(function (
  user: any,
  done: (err: Error | null, id: Number) => void
) {
  done(null, user.id);
});

/*
FIX ME (types) 😭 Done 😀
*/
passport.deserializeUser(function (
  id: number,
  done: (err: Error | null, user: Express.User | null) => void
) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done(Error("User not found"), null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: "local",
  strategy: localStrategy,
};

export default passportLocalStrategy;
