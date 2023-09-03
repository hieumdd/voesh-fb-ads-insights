import { Readable } from 'node:stream';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { createRepository } from '../secret-manager.service';
import { logger } from '../logging.service';
import { FacebookSecrets } from './secret.enum';

export const getClient = (token?: string) => {
    const API_VER = 'v17.0';

    const client = axios.create({
        baseURL: `https://graph.facebook.com/${API_VER}`,
        params: { access_token: token },
        paramsSerializer: { indexes: null },
    });

    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (axios.isAxiosError(error)) {
                logger.error({
                    error: {
                        config: error.config,
                        response: { data: error.response?.data, headers: error.response?.headers },
                    },
                });
            } else {
                logger.error({ error });
            }

            throw error;
        },
    );

    return client;
};

export const getAuthClient = async () => {
    return createRepository(FacebookSecrets.AccessToken).get().then(getClient);
};

export const getExtractStream = async (
    client: AxiosInstance,
    config: (after?: string) => AxiosRequestConfig,
) => {
    const stream = new Readable({ objectMode: true, read: () => {} });

    const _get = (after?: string) => {
        type GetResponse = {
            data: Record<string, any>[];
            paging?: { cursors: { after: string }; next: string };
        };

        client
            .request<GetResponse>(config(after))
            .then((response) => response.data)
            .then(({ data, paging }) => {
                data.forEach((row) => stream.push(row));
                paging?.next ? _get(paging.cursors.after) : stream.push(null);
            })
            .catch((error) => stream.emit('error', error));
    };

    _get();

    return stream;
};
