type User = {
  username: string;
  password: string;
  id: string;
  cookie: null;
};

type Users = User[];

const users: Users = [
  {
    username: "admin",
    password: "admin",
    id: "0",
    cookie: null,
  },
  {
    username: "member",
    password: "member",
    id: "1",
    cookie: null,
  },
  {
    username: "better member",
    password: "bettermember",
    id: "2",
    cookie: null,
  },
];

export default users;
