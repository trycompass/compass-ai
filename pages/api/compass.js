import Anthropic from "@anthropic-ai/sdk";
import pplx from '@api/pplx';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

pplx.auth(process.env.PPLX_API_KEY);

const SYSTEM_PROMPT = `You're Compass, a friendly AI community services navigator for the public. Your mission is to help users navigate the complexities of community services.

Key Approach:
1. Keep it short and concise: Use brief, punchy messages. Think texting, not emailing.
2. Emojis: Use them naturally, like in casual texting. Don't overdo it.
3. Friendly vibes: Chat like a close friend, not a formal government official.
4. Cultural savvy: Show understanding without lecturing.
5. Inclusive: Be comfortable with all cultural backgrounds.
6. Respectful: Don't assume religious or cultural practices.

If you need to search the web for community resources, use the web_search tool. Your search queries should be as specific as possible; ask the user for additional details if needed. Before running a search, always ask the user for their location so you can search for community resources specifically in their state. When you search for community services, always provide the user with the most relevant and up-to-date information.

Always cite your sources using inline citations like this: [[1]](https://example.gov).

Do not ask to run searches. Just do it. Don't narrate your thought process.

Today's date is ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.

Always respond in markdown format.`;

const WEB_SEARCH_TOOL = {
  name: "web_search",
  description: "Search the web for current information on a given topic",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query to run"
      }
    },
    required: ["query"]
  }
};

export const config = {
  maxDuration: 300,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: Array.isArray(msg.content) ? msg.content : [{ type: "text", text: msg.content }]
    }));

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      temperature: 1,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
      tools: [WEB_SEARCH_TOOL]
    });

    if (response.content.some(c => c.type === 'tool_use' && c.name === 'web_search')) {
      const toolUse = response.content.find(c => c.type === 'tool_use' && c.name === 'web_search');
      const searchResult = await pplx.post_chat_completions({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          { role: 'system', content: 'Be precise and concise.' },
          { role: 'user', content: toolUse.input.query }
        ]
      });

      const searchContent = searchResult.data.choices[0].message.content;
      const citations = searchResult.data.citations || [];

      // Format content to include citations
      const contentWithCitations = `${searchContent}\n\nSources:\n${citations.join('\n')}`;

      const finalResponse = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 8192,
        temperature: 1,
        system: SYSTEM_PROMPT,
        messages: [
          ...apiMessages,
          {
            role: "assistant",
            content: response.content
          },
          {
            role: "user",
            content: [
              {
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: contentWithCitations
              }
            ]
          }
        ],
        tools: [WEB_SEARCH_TOOL]
      });

      res.status(200).json({ response: finalResponse.content[0].text });
    } else {
      res.status(200).json({ response: response.content[0].text });
    }
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
}