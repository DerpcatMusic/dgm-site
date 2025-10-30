// Authentication types
export interface User {
	id: string;
	email: string;
	name?: string;
	image?: string;
	role: 'admin' | 'user';
}

export interface Session {
	user: {
		id: string;
		email: string;
		name?: string;
		image?: string;
	};
	accessToken: string;
}

// Passkey types
export interface PasskeyCredential {
	id: string;
	publicKey: string;
	counter: number;
	transports?: string[];
}

// Artist-related types and interfaces

export interface Artist {
	id: string;
	name: string;
	bio?: string;
	imageUrl?: string;
	genre?: string[];
	socialLinks?: SocialLink[];
}

export interface SocialLink {
	platform: string; // e.g., 'twitter', 'instagram', 'website'
	url: string;
}

// Additional types that might be necessary for artist-related data
export interface Album {
	id: string;
	title: string;
	artistId: string;
	releaseDate?: string;
	coverUrl?: string;
}

export interface Track {
	id: string;
	title: string;
	albumId: string;
	duration?: number; // in seconds
	url?: string;
}
