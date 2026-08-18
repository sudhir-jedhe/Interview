import { useEffect, useState } from "react";
import api from "../api";

type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  console.log(users);

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      }
    }

    loadMe();
  }, []);

  async function handleFetchAllUsers() {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data.users);
    } catch {
      setUsers([]);
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setUsers([]);
      setMessage("logout success");
    } catch {
      setMessage("logout failed");
    }
  }

  return (
    <div>
      <h2>Home</h2>

      {user ? (
        <div>
          <p>Logged in as: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <h1>Admin test</h1>
          <button onClick={handleFetchAllUsers}>Get All users</button>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>No logged in user</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
