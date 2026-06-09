export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, messages, max_tokens } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key is missing from backend environment variables.' });
    }

    // Direct HTTP Request to Anthropic API—bypassing SDK network wrappers entirely
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-20241022',
        max_tokens: max_tokens || 1024,
        messages: messages
      })
    });

    // If Anthropic returns an error state, catch it here explicitly
    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      return res.status(anthropicResponse.status).json({ error: `Anthropic API Error: ${errorText}` });
    }

    const data = await anthropicResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Network Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
