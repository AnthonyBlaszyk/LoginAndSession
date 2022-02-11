type User = {
  username: string;
  password: string;
  id: number;
  cookie: string | null;
  darkMode: boolean;
};

type Users = User[];

const users: Users = [
  {
    username: "admin",
    password: "admin",
    id: 0,
    cookie: null,
    darkMode: false,
  },
  {
    username: "member",
    password: "member",
    id: 1,
    cookie: null,
    darkMode: true,
  },
  {
    username: "better member",
    password: "bettermember",
    id: 2,
    cookie: null,
    darkMode: false,
  },
];

export default users;
