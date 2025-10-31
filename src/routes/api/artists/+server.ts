import { json, type RequestEvent } from '@sveltejs/kit';

// GET all artists for the landing page
export async function GET({ platform }: RequestEvent) {
	if (!platform?.env?.DB) {
		return json({ error: 'Database not available' }, { status: 500 });
	}
	const { results } = await platform.env.DB.prepare('SELECT * FROM artists ORDER BY name').all();
	return json(results);
}

// POST a new artist from the admin panel
export async function POST({ request, platform }: RequestEvent) {
	if (!platform?.env?.DB) {
		return json({ error: 'Database not available' }, { status: 500 });
	}

	const { name, bio, imageUrl, genre, socialLinks }: {
		name: string;
		bio?: string;
		imageUrl: string;
		genre?: string[];
		socialLinks?: Record<string, string>;
	} = await request.json();

	if (!name || !imageUrl) {
		return json({ error: 'Name and image URL are required.' }, { status: 400 });
	}

	const { success } = await platform.env.DB.prepare(
		'INSERT INTO artists (name, bio, image_url, genre, social_links) VALUES (?, ?, ?, ?, ?)'
	)
		.bind(name, bio, imageUrl, JSON.stringify(genre), JSON.stringify(socialLinks))
		.run();

	if (success) {
		return json({ message: 'Artist added!' }, { status: 201 });
	} else {
		return json({ error: 'Database insert failed.' }, { status: 500 });
	}
}
