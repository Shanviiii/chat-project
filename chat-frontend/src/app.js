import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 🔹 Login Function (matches backend)
  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      setToken(res.data.token);
      alert("Login Successful");
    } catch (err) {
      alert("Login Failed");
    }
  };

  // 🔹 Send Message (matches socket.js)
  const sendMessage = () => {
    if (!message) return;

    socket.emit("sendMessage", {
      text: message,
    });

    setMessage("");
  };

  // 🔹 Receive Message
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  return (
    <div style={{ padding: 30 }}>
      {!token ? (
        <>
          <h2>Login</h2>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br /><br />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />
          <button onClick={login}>Login</button>
        </>
      ) : (
        <>
          <h2>Chat</h2>

          <input
            value={message}
            placeholder="Type message..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>

          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg.text}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;

