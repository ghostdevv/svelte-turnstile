import { z } from 'zod';

export const schema = z.object({
	name: z.string().default('Hello world!'),
	'cf-turnstile-response': z.string().nonempty('Please complete turnstile'),
});
