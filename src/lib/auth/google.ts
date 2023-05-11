import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { google } from 'googleapis';

class GoogleProvider {
    protected clientId: string;
    protected clientSecret: string;
    protected callbackUrl: string;

    constructor(option: { clientId: string; clientSecret: string; callbackUrl: string }) {
        this.clientId = option.clientId;
        this.clientSecret = option.clientSecret;
        this.callbackUrl = option.callbackUrl;
    }

    getClient() {
        const client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.callbackUrl);

        return client;
    }

    getAuthUrl() {
        const client = this.getClient();
        const url = client.generateAuthUrl({
            access_type: 'online',
            scope: ['profile', 'email']
        });

        return url;
    }

    async authenticate(req: Request) {
        const client = this.getClient();
        const code = new URL(req.url).searchParams.get('code') ?? '';

        try {
            const { tokens } = await client.getToken(code);
            const ticket = await client.verifyIdToken({ idToken: tokens.id_token ?? '' });
            const payload = ticket.getPayload();

            if (payload === undefined) {
                return undefined;
            } else {
                return {
                    id: payload.sub,
                    name: payload.name as string,
                    email: payload.email as string,
                    picture: payload.picture as string,
                    provider: 'google'
                };
            }
        } catch (e) {
            return undefined;
        }
    }
}

export const googleProvider = new GoogleProvider({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackUrl: 'http://localhost:5173/auth/google/callback'
});
