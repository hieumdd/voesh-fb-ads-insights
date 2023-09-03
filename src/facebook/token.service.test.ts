import { refreshToken } from './token.service';

it('refresh-token', async () => {
    return refreshToken()
        .then((result) => expect(result).toBeDefined())
        .catch((error) => {
            console.error({ error });
            throw error;
        });
});
