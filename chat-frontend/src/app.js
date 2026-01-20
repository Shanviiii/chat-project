import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const login = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password
    });
    setToken(res.data.token);
  };

  const sendMessage = () => {
    socket.emit("sendMessage", {
      text: message
    });
    setMessage("");
  };

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      {!token ? (
        <>
          <h3>Login</h3>
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Password" type="password"
            onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </>
      ) : (
        <>
          <h3>Chat</h3>
          <input
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>

          <ul>
            {messages.map((m, i) => (
              <li key={i}>{m.text}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
