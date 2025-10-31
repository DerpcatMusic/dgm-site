import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import {
	generateRegistrationOptions,
	verifyRegistrationResponse,
	generateAuthenticationOptions,
	verifyAuthenticationResponse
} from '@simplewebauthn/server';

const RP_NAME = 'DGM Site';
const RP_ID = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

// In-memory storage for demo purposes - replace with proper database
const userAuthenticators: Map<string, any[]> = new Map();

export async function registerPasskey(
	userId: string,
	userName: string,
	userDisplayName: string
): Promise<boolean> {
	try {
		// Generate registration options
		const options = await generateRegistrationOptions({
			rpName: RP_NAME,
			rpID: RP_ID,
			userID: new Uint8Array(Buffer.from(userId, 'utf-8')),
			userName: userName,
			userDisplayName: userDisplayName,
			attestationType: 'direct',
			authenticatorSelection: {
				authenticatorAttachment: 'platform',
				userVerification: 'preferred',
				requireResidentKey: true
			}
		});

		// Start registration on client
		const attResp = await startRegistration({ optionsJSON: options as any });

		// Verify registration response
		const verification = await verifyRegistrationResponse({
			response: attResp,
			expectedChallenge: options.challenge,
			expectedOrigin: ORIGIN,
			expectedRPID: RP_ID
		});

		if (verification.verified) {
			const { registrationInfo } = verification;
			const existingAuthenticators = userAuthenticators.get(userId) || [];
			existingAuthenticators.push({
				credentialID: registrationInfo!.credential.id,
				credentialPublicKey: registrationInfo!.credential.publicKey,
				counter: registrationInfo!.credential.counter,
				credentialDeviceType: registrationInfo!.credentialDeviceType,
				credentialBackedUp: registrationInfo!.credentialBackedUp,
				transports: attResp.response.transports
			});
			userAuthenticators.set(userId, existingAuthenticators);
			return true;
		}

		return false;
	} catch (error) {
		console.error('Passkey registration failed:', error);
		return false;
	}
}

export async function authenticatePasskey(userId: string): Promise<boolean> {
	try {
		const userAuthenticatorsList = userAuthenticators.get(userId) || [];

		if (userAuthenticatorsList.length === 0) {
			throw new Error('No passkeys registered for this user');
		}

		// Generate authentication options
		const options = await generateAuthenticationOptions({
			rpID: RP_ID,
			allowCredentials: userAuthenticatorsList.map((authenticator) => ({
				id: authenticator.credentialID,
				type: 'public-key' as const,
				transports: authenticator.transports
			})),
			userVerification: 'preferred'
		});

		// Start authentication on client
		const attResp = await startAuthentication({ optionsJSON: options as any });

		// Get authenticator from database
		const authenticator = userAuthenticatorsList.find((auth) => auth.credentialID === attResp.id);

		if (!authenticator) {
			throw new Error('Authenticator not found');
		}

		// Verify authentication response
		const verification = await verifyAuthenticationResponse({
			response: attResp,
			expectedChallenge: options.challenge,
			expectedOrigin: ORIGIN,
			expectedRPID: RP_ID,
			credential: {
				id: authenticator.credentialID,
				publicKey: new Uint8Array(Buffer.from(authenticator.credentialPublicKey, 'base64')),
				counter: authenticator.counter,
				transports: authenticator.transports
			}
		});

		if (verification.verified) {
			// Update counter in database
			authenticator.counter = verification.authenticationInfo.newCounter;
			return true;
		}

		return false;
	} catch (error) {
		console.error('Passkey authentication failed:', error);
		return false;
	}
}

export function hasPasskeys(userId: string): boolean {
	return (userAuthenticators.get(userId) || []).length > 0;
}
