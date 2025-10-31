
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, previousId } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: message,
        instructions:
          "You are Sakura AI, a kind teacher who helps users learn JavaScript. Output must be in plain text (no markdown).",
        ...(previousId ? { previous_response_id: previousId } : {}),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    const output = data.output?.[0]?.content?.[0]?.text || "No response 🌸";

    return res.status(200).json({
      reply: output,
      response_id: data.id,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
