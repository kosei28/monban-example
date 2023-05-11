import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } from '$env/static/private';
import { Monban, MemorySessionStore, UserManager } from 'monban';
import { GoogleProvider, type InferAccountInfo } from 'monban/providers';

type User = {
    id: string;
    name: string;
    email: string;
    picture: string;
    provider: string;
};

const providers = {
    google: new GoogleProvider({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET
    })
};

type AccountInfo = InferAccountInfo<typeof providers>;

declare global {
    // eslint-disable-next-line no-var
    var users: Record<string, User> | undefined;
}

class MyUserManager extends UserManager<AccountInfo> {
    async createUser(accountInfo: AccountInfo): Promise<string> {
        if (globalThis.users === undefined) {
            globalThis.users = {};
        }

        globalThis.users[accountInfo.id] = accountInfo;

        return accountInfo.id;
    }

    async getUser(userId: string): Promise<User | undefined> {
        if (globalThis.users === undefined) {
            return undefined;
        }

        return globalThis.users[userId];
    }

    async deleteUser(userId: string): Promise<void> {
        if (globalThis.users !== undefined) {
            delete globalThis.users[userId];
        }
    }
}

const sessionStore = new MemorySessionStore();
const userManager = new MyUserManager();

export const monban = new Monban(providers, sessionStore, userManager, { secret: JWT_SECRET });
