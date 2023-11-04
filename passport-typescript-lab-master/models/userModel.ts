let database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role: "User",
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role: "User",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role: "User",
  },
  {
    id: 4,
    name: "Administrator",
    email: "admin@admin.com",
    password: "password",
    role: "Admin",
  },
];

const userModel = {
  /* FIX ME (types) 😭 Done 😀 */
  findOne: (email: string) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  /* FIX ME (types) 😭 Done 😀 */
  findById: (id: number) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
  addUser: (id: number, name: string) => {
    database.push({
      id: id,
      name: name,
      email: "",
      password: "",
      role: "User",
    });
  },
};

export { database, userModel };
