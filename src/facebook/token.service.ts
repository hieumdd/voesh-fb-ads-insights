import { createRepository } from '../secret-manager.service';
import { FacebookSecrets } from './secret.enum';
import { getClient } from './api.service';

const redirectURI = 'https://oauth.pstmn.io/v1/browser-callback';

export const refreshToken = async () => {
    const oauthClient = getClient();

    const [clientId, clientSecret] = await Promise.all([
        createRepository(FacebookSecrets.ClientId).get(),
        createRepository(FacebookSecrets.ClientSecret).get(),
    ]);

    const getClientCode = async (token: string) => {
        type GetClientCodeResponse = { code: string };

        return oauthClient
            .request<GetClientCodeResponse>({
                method: 'GET',
                url: '/oauth/client_code',
                params: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectURI,
                    access_token: token,
                },
            })
            .then(({ data }) => data.code);
    };

    const getAccessToken = async (code: string) => {
        type GetAccessTokenResponse = {
            access_token: string;
            machine_id: string;
            expires_in: number;
        };

        return oauthClient
            .request<GetAccessTokenResponse>({
                method: 'GET',
                url: '/oauth/access_token',
                params: {
                    client_id: clientId,
                    machine_id: 'voesh',
                    redirect_uri: redirectURI,
                    code,
                },
            })
            .then(({ data }) => data.access_token);
    };

    const { get, set } = createRepository(FacebookSecrets.AccessToken);

    return get().then(getClientCode).then(getAccessToken).then(set);
};
