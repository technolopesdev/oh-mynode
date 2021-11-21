import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';

interface ISendMail {
    to: string;
    subject: string;
    data: any;
    template: string;
}

export function genToken(id: string): string {
    const secret = process.env.SECRET as string;
    return jwt.sign({ id }, secret, {
        expiresIn: 12 * 60 * 60
    });
}
export function mathRand(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
export async function sendMail({ data, subject, template, to }: ISendMail) {

    const host = process.env.MAIL_HOST as string;
    const port = Number(process.env.MAIL_PORT);
    const user = process.env.MAIL_USER as string;
    const pass = process.env.MAIL_PASS as string;
    const from = process.env.MAIL_FROM as string;

    const file = await fs.readFile(path.resolve(__dirname, '..', '..', 'template', `${template}.ejs`), {
        encoding: 'utf-8'
    });

    const compiled = ejs.compile(file);

    const transport = nodemailer.createTransport({
        host,
        port,
        auth: {
            user,
            pass
        }
    });

    await transport.sendMail({
        to,
        from,
        subject,
        html: compiled(data)
    });

}
