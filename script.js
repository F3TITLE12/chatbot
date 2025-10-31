// === Sakura Chatbot Script ===
// Safe frontend using Vercel proxy (/api/chat)

const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBody = document.getElementById("chatBody");
const themeToggle = document.getElementById("themeToggle");

let lastResponseId = "";

// 💬 Add message to chat
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  if (sender === "bot") {
    msg.innerHTML = `
      <img src="https://preview.redd.it/what-is-this-goofy-dance-called-v0-c3q5xap1uqye1.gif?width=640&auto=webp&s=f5ade48e1fb0a21d3dc991c7c1d62d17b80bb350" class="avatar">
      <div class="bot-bubble"><p>${text}</p></div>`;
  } else {
    msg.innerHTML = `
      <div class="user-bubble"><p>${text}</p></div>
      <img src="https://media.tenor.com/zCxWDS8FsFQAAAAM/shibuya-station-haru.gif" alt="User" class="avatar">`;
  }

  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
  return msg;
}

// 📤 Send button + Enter key
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// 🚀 Send message function
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage("user", text);
  userInput.value = "";

  const thinkingMsg = addMessage("bot", "Thinking... 🌸");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        previousId: lastResponseId,
      }),
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error);
    thinkingMsg.querySelector("p").textContent = data.reply;

    lastResponseId = data.response_id;
  } catch (err) {
    console.error("Error:", err);
    thinkingMsg.querySelector("p").textContent =
      "Oops! Something went wrong. 🌸";
  }
}

// 🎨 Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("theme-sakura");
  document.body.classList.toggle("theme-cyberpunk");
});
