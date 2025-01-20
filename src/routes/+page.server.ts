import type { Actions } from './$types';
import { validateToken } from './utils';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const token = data.get('cf-turnstile-response') as string;
		const secret = data.get('secret') as string;

		const { success, error } = await validateToken(token, secret);

		if (!success) {
			return {
				error: error || 'Invalid CAPTCHA',
			};
		}

		return {
			valid: true,
		};
	},
};
