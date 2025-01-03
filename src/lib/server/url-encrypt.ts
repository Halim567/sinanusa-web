import { env } from '$env/dynamic/private';
import crypto from 'crypto';

export const encryptQueryParams = (text: string) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', env.ENCRYPT_KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag().toString('hex');

    return `${encrypted}/${iv.toString('hex')}/${tag}`;
}

export const decryptQueryParams = (text: string) => {
    const [encrypted, ivText, tagText] = text.split('/');
    const iv = Buffer.from(ivText, 'hex');
    const tag = Buffer.from(tagText, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', env.ENCRYPT_KEY, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
}