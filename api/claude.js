import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, messages, max_tokens } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key is missing from backend environment variables.' });
    }

    // FIX: Force the SDK to use global fetch to prevent Node 24 handshake failures
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      fetch: globalThis.fetch, 
    });

    const response = await anthropic.messages.create({
      model: model || 'claude-3-5-sonnet-20241022', 
      max_tokens: max_tokens || 1024,
      messages: messages,
    });

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
