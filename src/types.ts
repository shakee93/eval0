import { z } from 'zod';

// Base configuration options
export interface Eval0Config {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    apiKey?: string;
    schema?: z.ZodType;
}

// Type helper for Zod schema inference
export type Infer<T> = T extends z.ZodType<infer U> ? U : never;

// Full options for the main call signature
export interface Eval0Options<T extends z.ZodType> extends Omit<Eval0Config, 'schema'> {
    query: string;
    input?: unknown;
    schema: T;
}

// Response type
export interface Eval0Response<T> {
    value: T;
    metadata: {
        model: string;
        tokens: number;
        latency: number;
        ai_sdk: any;
    };
} 