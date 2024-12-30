import { eval0 } from '../src';
import { eval0 as streamEval0 } from '../src/stream';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

async function examples() {
    // 1. Full options with schema
    const { value: isValid, metadata } = await eval0({
        query: 'Is this valid?',
        input: 'test@example.com',
        schema: z.boolean()
    });
    if (isValid) {
        console.log('Valid email!', metadata);
    }

    // 2. Query only (uses default string schema)
    const { value: simpleString } = await eval0('What color is the sky?');
    console.log('Color:', simpleString);

    // 3. Query with options
    const isValidAlt = await eval0(
        'Is this valid?',
        {
            schema: z.boolean(),
            temperature: 0.5
        }
    );
    console.log('Is Valid:', isValidAlt.value);

    // 4. Query with input and options
    const { value: isValidWithInput } = await eval0(
        'Is this valid?',
        'test@example.com',
        { schema: z.boolean() }
    );
    console.log('Is Valid:', isValidWithInput);

    // Complex object schema example
    const quoteSchema = z.object({
        quote: z.string(),
        author: z.string()
    });

    const { value: quote } = await eval0({
        query: 'Give me a motivational quote',
        schema: quoteSchema
    });
    console.log(`${quote.quote} - ${quote.author}`);

    // Enum schema example
    const sentimentSchema = z.object({
        sentiment: z.enum(['positive', 'negative', 'neutral'])
    });

    const { value: sentiment } = await eval0({
        query: 'Analyze sentiment',
        input: 'I love this product!',
        schema: sentimentSchema,
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 50
    });
    if (sentiment.sentiment === 'positive') {
        console.log('Positive feedback!');
    }

    // String schema example with metadata usage
    const { value: summary, metadata: summaryMetadata } = await eval0({
        query: 'Summarize in one word',
        input: 'The quick brown fox jumps over the lazy dog',
        schema: z.string()
    });
    console.log(`Summary: ${summary} (took ${summaryMetadata.latency}ms)`);

    // Streaming examples
    console.log('\nStreaming Examples:');

    // 1. Basic streaming
    console.log('\nBasic streaming:');
    process.stdout.write('Response: ');
    for await (const chunk of streamEval0('What is the capital of France?')) {
        process.stdout.write(chunk);
    }
    console.log('\n');

    // 2. Streaming with input
    console.log('\nStreaming with input:');
    process.stdout.write('Response: ');
    for await (const chunk of streamEval0(
        'Is this a valid email?',
        'test@example.com'
    )) {
        process.stdout.write(chunk);
    }
    console.log('\n');

    // 3. Streaming with options
    console.log('\nStreaming with options:');
    process.stdout.write('Response: ');
    for await (const chunk of streamEval0(
        'Tell me a very short joke',
        { temperature: 0.8, maxTokens: 30 }
    )) {
        process.stdout.write(chunk);
    }
    console.log('\n');
}

// Run examples
examples().catch(console.error); 