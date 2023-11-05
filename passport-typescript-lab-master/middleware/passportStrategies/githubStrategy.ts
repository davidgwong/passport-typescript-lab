import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";
import { getUserById, addNewUser } from "../../controllers/userController";
import "dotenv/config";

let githubClientID: string;
if (process.env.GITHUB_CLIENT_ID) {
  githubClientID = process.env.GITHUB_CLIENT_ID;
} else {
  throw new Error("GITHUB_CLIENT_ID environment variable is not set");
}

let githubClientSecret: string;
if (process.env.GITHUB_CLIENT_SECRET) {
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
} else {
  throw new Error("GITHUB_CLIENT_SECRET environment variable is not set");
}

const githubStrategy: GitHubStrategy = new GitHubStrategy(
  {
    clientID: githubClientID,
    clientSecret: githubClientSecret,
    callbackURL: "http://localhost:8000/auth/github/callback",
  },

  /* FIX ME 😭 Done 😀 */
  async (
    req: any,
    accessToken: string,
    refreshToken: any,
    profile: any,
    done: any
  ) => {
    try {
      done(null, getUserById(profile.id));
    } catch (err) {
      addNewUser(profile.id, profile.displayName);
      done(null, getUserById(profile.id));
    }
  }
);

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategy,
};

export default passportGitHubStrategy;
