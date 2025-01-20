import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { validateToken } from '../utils';
import { schema } from './schema';

export const load = async () => {
	const form = await superValidate(zod(schema));
	return { form };
};

export const actions = {
	pass: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) return fail(400, { form });

		const { success } = await validateToken(
			form.data['cf-turnstile-response'],
			// Use the always pass testing secret
			'1x0000000000000000000000000000000AA',
		);

		if (!success) {
			return setError(
				form,
				'cf-turnstile-response',
				'Invalid turnstile, please try again',
			);
		}

		return message(form, 'Success!');
	},
	fail: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) return fail(400, { form });

		const { success } = await validateToken(
			form.data['cf-turnstile-response'],
			// Use the always fail testing secret
			'2x0000000000000000000000000000000AA',
		);

		if (!success) {
			return setError(
				form,
				'cf-turnstile-response',
				'Invalid turnstile, please try again',
			);
		}

		return message(form, 'Success!');
	},
};
