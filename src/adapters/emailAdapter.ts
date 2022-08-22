import {emailRepository} from "../repositories/email-repository";

export const emailAdapter = {

    async sendEmail(email: string | undefined, code: string) {
        return await emailRepository.sendEmail(email, code)
    }
}