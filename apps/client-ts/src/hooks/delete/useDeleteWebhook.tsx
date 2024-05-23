import config from '@/lib/config';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

interface IWebhookDto {
    id_webhook: string;
}

const useDeleteWebhook = () => {
    const remove = async (webhookData: IWebhookDto) => {
        const response = await fetch(`${config.API_URL}/webhook/${webhookData.id_webhook}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete api key');
        }
        return response.json();
    };

    const deleteWebhookPromise = (data: IWebhookDto) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await remove(data);
                resolve(result);
                
            } catch (error) {
                reject(error);
            }
        });
    };

    return {
        mutate: useMutation({
            mutationFn: remove,
        }),
        deleteWebhookPromise,
    };
};

export default useDeleteWebhook;
