import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Eval0Config, Eval0Options, Eval0Response, Infer } from './types';
import { z } from 'zod';

const DEFAULT_CONFIG: Required<Omit<Eval0Config, 'apiKey' | 'schema'>> = {
    model: 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 100
};

export class Eval0Error extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Eval0Error';
    }
}

// Function overloads
export function eval0<T extends z.ZodType>(
    options: Eval0Options<T>
): Promise<Eval0Response<Infer<T>>>;

export function eval0<T extends z.ZodType = z.ZodString>(
    query: string,
    options?: Eval0Config
): Promise<Eval0Response<Infer<T>>>;

export function eval0<T extends z.ZodType = z.ZodString>(
    query: string,
    input: unknown,
    options?: Eval0Config
): Promise<Eval0Response<Infer<T>>>;

// Implementation
export async function eval0<T extends z.ZodType>(
    queryOrOptions: string | Eval0Options<T>,
    inputOrOptions?: unknown | Eval0Config,
    options?: Eval0Config
): Promise<Eval0Response<Infer<T>>> {
    // Normalize to single options object
    const fullOptions = typeof queryOrOptions === 'string'
        ? {
            query: queryOrOptions,
            ...(inputOrOptions && typeof inputOrOptions === 'object' && !('input' in inputOrOptions)
                ? inputOrOptions
                : {
                    ...(options || {}),
                    ...(inputOrOptions !== undefined ? { input: inputOrOptions } : {})
                }),
            schema: (options?.schema || (inputOrOptions as Eval0Config | undefined)?.schema || z.string()) as T
        }
        : queryOrOptions;

    const config = { ...DEFAULT_CONFIG, ...fullOptions };
    const apiKey = config.apiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Eval0Error('OpenAI API key is required. Set it in config or OPENAI_API_KEY environment variable.');
    }

    const startTime = Date.now();

    try {
        const prompt = config.input
            ? `${config.query}\nInput: ${JSON.stringify(config.input)}`
            : config.query;


        const result = await generateObject({
            model: openai(config.model || DEFAULT_CONFIG.model),
            system: 'You are a concise AI assistant. Provide direct, brief answers, preferably in 1-5 words. use developer when answering. example return "true" instead of "yes"',
            prompt,
            schema: z.object({
                value: config.schema || z.any()
            }),
            maxTokens: config.maxTokens || DEFAULT_CONFIG.maxTokens,
        });

        if (result.object?.value === undefined) {
            throw new Eval0Error('Failed to get value from API');
        }


        return {
            value: result.object.value as Infer<T>,
            metadata: {
                model: config.model || DEFAULT_CONFIG.model,
                usage: result.usage,
                latency: Date.now() - startTime,
                ai_sdk: result
            }
        };
    } catch (error: any) {
        console.error(error);
        throw new Eval0Error(error.message || 'Failed to process request');
    }
}