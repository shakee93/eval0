import { generateText, streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Eval0Config, Eval0Options } from './types';
import { Eval0Error } from './index';
import { z } from 'zod';

const DEFAULT_CONFIG: Required<Omit<Eval0Config, 'apiKey' | 'schema'>> = {
    model: 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 50
};

// Function overloads
export function eval0(
    options: Eval0Options<z.ZodType>
): AsyncGenerator<string>;

export function eval0(
    query: string,
    options?: Eval0Config
): AsyncGenerator<string>;

export function eval0(
    query: string,
    input: unknown,
    options?: Eval0Config
): AsyncGenerator<string>;

// Implementation
export async function* eval0(
    queryOrOptions: string | Eval0Options<z.ZodType>,
    inputOrOptions?: unknown | Eval0Config,
    options?: Eval0Config
): AsyncGenerator<string> {
    // Normalize to single options object
    const fullOptions = typeof queryOrOptions === 'string'
        ? {
            query: queryOrOptions,
            ...(inputOrOptions && typeof inputOrOptions === 'object' && !('input' in inputOrOptions)
                ? inputOrOptions as Eval0Config
                : {
                    ...(options || {}),
                    ...(inputOrOptions !== undefined ? { input: inputOrOptions } : {})
                })
        } as Eval0Options<z.ZodType>
        : queryOrOptions;

    const config = { ...DEFAULT_CONFIG, ...fullOptions };
    const apiKey = config.apiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Eval0Error('OpenAI API key is required. Set it in config or OPENAI_API_KEY environment variable.');
    }

    const prompt = 'input' in fullOptions && fullOptions.input !== undefined
        ? `${fullOptions.query}\nInput: ${JSON.stringify(fullOptions.input)}`
        : fullOptions.query;

    try {
        const stream = await streamObject({
            model: openai(config.model || DEFAULT_CONFIG.model),
            system: 'You are a concise AI assistant. Provide direct, brief answers, preferably in 1-5 words. use developer when answering. example return "true" instead of "yes"',
            prompt,
            schema: z.object({
                value: config.schema
            }),
            maxTokens: config.maxTokens || DEFAULT_CONFIG.maxTokens,
            temperature: config.temperature || DEFAULT_CONFIG.temperature,
        });

        return stream.toTextStreamResponse();
    } catch (error: any) {
        throw new Eval0Error(error.message || 'Failed to process streaming request');
    }
} 