import type { Actions } from './$types';

interface TokenValidateResponse {
	'error-codes': string[];
	success: boolean;
	action: string;
	cdata: string;
}

async function validateToken(token: string, secret: string) {
	const response = await fetch(
		'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				response: token,
				secret: secret,
			}),
		},
	);

	const data: TokenValidateResponse = await response.json();

	return {
		success: data.success,
		error: data['error-codes']?.length ? data['error-codes'][0] : null,
	};
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const token = data.get('cf-turnstile-response') as string;
		const secret = data.get('secret') as string;

		const { success, error } = await validateToken(token, secret);

		if (!success)
			return {
				error: error || 'Invalid CAPTCHA',
			};

		return {
			valid: true,
		};
	},
};
