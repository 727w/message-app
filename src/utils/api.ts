import axios from 'axios';

async function sendMessage(content: string, context: {type: "direct"|"group"; targetId: string}) {
  try {
    await axios.post(
      "/api/new/messages",
      {
        type: context.type,
        targetId: context.targetId,
        content,
      },
      { withCredentials: true } // penting jika pakai cookie JWT
    );
  } catch (err) {
    console.error("Failed to send message", err);
  }
}

export { sendMessage };