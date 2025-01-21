# Eval0

> One line AI for your Applications

[![npm version](https://badge.fury.io/js/eval0.svg)](https://badge.fury.io/js/eval0)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Eval0 is a lightweight TypeScript SDK that provides instant AI-powered evaluations, validations, and transformations with just one line of code. Built on top of OpenAI's GPT models, it offers type-safe responses using Zod schemas.

## Features

- 🚀 **Simple API** - One function for all your AI needs
- 🔒 **Type-Safe** - Built-in TypeScript support with Zod schemas
- 🌊 **Concise Responses** - Optimized for 1-5 word answers
- 🛠 **Flexible Input** - Multiple function signatures for convenience
- 📦 **Zero Config** - Works out of the box with sensible defaults

## Installation

```bash
npm install eval0
# or
yarn add eval0
# or
pnpm add eval0
```

## Quick Start

### One-Liners ⚡️


Create a concise title for a chat message
```typescript
import { eval0 } from 'eval0';

const { value: title } = await eval0('Concise title for this message:', 'Hello, how can I help you today?');
console.log(title); // "Hello, how can I help?"
```


Quick classifications (returns string)
```typescript
const { value: sentiment } = await eval0('positive or negative?', 'I love it!');

console.log(sentiment); // "positive"
```


Fast summaries (returns string)
```typescript
const content = 'The quick brown fox jumps over the lazy dog';
const { value: summary } = await eval0('Summarize in one word', content);

console.log(summary); // "agility"
```

Quick content moderation (returns boolean)
```typescript
const { value: isSafe } = await eval0('Is this message safe for kids?', 'Let\'s play minecraft!');

console.log(isSafe); // "true"
```

### Advanced Usage with Schemas 🔒

```typescript
import { eval0 } from 'eval0';
import { z } from 'zod';

// Enum-based classification with confidence
const { value: analysis } = await eval0({
    query: 'Analyze sentiment',
    input: 'I love this product!',
    schema: z.object({
        sentiment: z.enum(['positive', 'negative', 'neutral']),
        confidence: z.number().min(0).max(1)
    }),
    temperature: 0.3
});

if (analysis.sentiment === 'positive' && analysis.confidence > 0.8) {
    console.log('High confidence positive feedback!');
}
```

## Usage

### Basic Usage

Eval0 provides three ways to call the function:

1. **Full Options Object**
```typescript
const { value: response } = await eval0({
    query: 'Your question here',
    input: 'Optional input data',
    schema: z.string(), // Zod schema for type-safe responses
    temperature: 0.5,   // Optional: Control randomness
    maxTokens: 50      // Optional: Limit response length
});
```

2. **Query with Options**
```typescript
const { value: quote } = await eval0('a motivational quote', {
    schema: z.object({
        quote: z.string(),
        author: z.string()
    })
});

console.log(`${quote.quote} - ${quote.author}`);
```

3. **Query, Input, and Options**
```typescript
const { value: response } = await eval0(
    'Your question here',
    'Input data',
    { schema: z.boolean() }
);
```

### Type-Safe Responses

Use Zod schemas to ensure type safety:

```typescript
// Enum responses
const { value: sentiment } = await eval0({
    query: 'Analyze sentiment',
    input: 'I love this product!',
    schema: z.object({
        sentiment: z.enum(['positive', 'negative', 'neutral'])
    })
});

if (sentiment.sentiment === 'positive') {
    console.log('Positive feedback!');
}

// Complex validations
const { value: analysis } = await eval0({
    query: 'Analyze text complexity',
    input: 'Your text here',
    schema: z.object({
        complexity: z.number().min(0).max(10),
        reasons: z.array(z.string()),
        suggestion: z.string().optional()
    })
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `query` | `string` | Required | The question or instruction |
| `input` | `unknown` | Optional | Input data to analyze |
| `schema` | `z.ZodType` | `z.string()` | Zod schema for response type |
| `model` | `string` | 'gpt-4o-mini' | OpenAI model to use |
| `temperature` | `number` | 0.3 | Response randomness (0-1) |
| `maxTokens` | `number` | 100 | Maximum response length |
| `apiKey` | `string` | From env | OpenAI API key |

## Response Structure

```typescript
interface Eval0Response<T> {
    value: T;              // The typed response value based on schema
    metadata: {
        model: string;     // OpenAI model used (e.g., 'gpt-4o-mini')
        tokens: number;    // Total tokens consumed
        latency: number;   // Response time in milliseconds
        ai_sdk: any;      // Raw AI SDK response data
    };
}

const { value } = await eval0<Eval0Response<string>>('positive or negative?', 'I love it!');
console.log(value);

```

## Environment Variables

```bash
# Required: Your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
```

## Examples

Check out the [examples](./examples) directory for more usage examples.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Built with ❤️ using:
- [OpenAI](https://openai.com)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Zod](https://github.com/colinhacks/zod)

---

Made with ☕️ by [@shakee93](https://github.com/shakee93)

## Troubleshooting

### Common Issues

1. **API Key Not Found**
```typescript
// Error: OpenAI API key is required
// Solution: Set your API key in .env file or pass it in options
const response = await eval0('query', {
    apiKey: 'your_openai_api_key'
});
```

2. **Schema Type Mismatch**
```typescript
// Error: Type mismatch in response
// Solution: Ensure your schema matches expected response
const response = await eval0({
    query: 'Is this valid?',
    schema: z.boolean(), // Use correct schema type
});
```

3. **Rate Limiting**
```typescript
// Error: Too many requests
// Solution: Add delay between requests or upgrade API plan
await new Promise(r => setTimeout(r, 1000)); // Add delay
const response = await eval0('query');
```

4. **Response Too Long**
```typescript
// Error: Response exceeds maxTokens
// Solution: Increase maxTokens or modify prompt
const response = await eval0('query', {
    maxTokens: 200 // Increase token limit
});
```

## Examples

Check out the [examples](./examples) directory for more usage examples.
