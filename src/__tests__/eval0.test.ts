import { z } from 'zod';
import { eval0 } from '../index';
import dotenv from 'dotenv';

dotenv.config();

describe('eval0', () => {
    // it('should handle options object signature', async () => {
    //     const response = await eval0({
    //         query: 'Is this a valid email?',
    //         input: 'test@example.com',
    //         schema: z.boolean()
    //     });

    //     expect(typeof response.value).toBe('boolean');
    //     expect(response).toMatchObject({
    //         metadata: {
    //             model: 'gpt-4o-mini',
    //             tokens: expect.any(Number),
    //             latency: expect.any(Number),
    //             ai_sdk: expect.any(Object)
    //         }
    //     });
    // });

    it('should handle query and options signature', async () => {
        const response = await eval0(
            'Is this a valid email?',
            {
                schema: z.boolean()
            }
        );


        console.log(response);
        expect(typeof response.value).toBe('boolean');
        expect(response).toMatchObject({
            metadata: {
                model: 'gpt-4o-mini',
                usage: expect.any(Object),
                latency: expect.any(Number),
                ai_sdk: expect.any(Object)
            }
        });
    });

    // it('should handle query, input, and options signature', async () => {
    //     const response = await eval0(
    //         'Is this a valid email?',
    //         'test@example.com',
    //         { schema: z.boolean() }
    //     );

    //     expect(typeof response.value).toBe('boolean');
    //     expect(response).toMatchObject({
    //         metadata: {
    //             model: 'gpt-4o-mini',
    //             tokens: expect.any(Number),
    //             latency: expect.any(Number),
    //             ai_sdk: expect.any(Object)
    //         }
    //     });
    // });

    // it('should handle schema validation with complex objects', async () => {
    //     const quoteSchema = z.object({
    //         quote: z.string(),
    //         author: z.string()
    //     });

    //     const response = await eval0({
    //         query: 'Give me a motivational quote',
    //         schema: quoteSchema
    //     });

    //     expect(response.value).toEqual({
    //         quote: expect.any(String),
    //         author: expect.any(String)
    //     });
    //     expect(response.metadata.tokens).toBeGreaterThan(0);
    //     expect(response.metadata.ai_sdk).toEqual(expect.any(Object));
    // });
});
