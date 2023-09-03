import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const secretManager = new SecretManagerServiceClient();

export const createRepository = (secretName: string) => {
    const get = async () => {
        return secretManager
            .getProjectId()
            .then((projectId) => `projects/${projectId}/secrets/${secretName}/versions/latest`)
            .then((name) => secretManager.accessSecretVersion({ name }))
            .then(([res]) => res.payload?.data?.toString() || '');
    };

    const set = async (value: string) => {
        const data = Buffer.from(value, 'utf-8');
        return secretManager
            .getProjectId()
            .then((projectId) => `projects/${projectId}/secrets/${secretName}`)
            .then((parent) => secretManager.addSecretVersion({ parent, payload: { data } }));
    };

    return { get, set };
};
