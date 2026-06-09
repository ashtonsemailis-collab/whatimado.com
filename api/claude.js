import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, max_tokens } = req.body;

    // Use the global environment variable directly
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // or your preferred model version
      max_tokens: max_tokens || 1024,
      messages: messages,
    });

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
