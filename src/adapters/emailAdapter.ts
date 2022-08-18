import {emailRepository} from "../repositories/email-repository";

export const emailAdapter = {

    async sendEmail(email: string, code: string) {
        return await emailRepository.sendEmail(email, code)
    }
}