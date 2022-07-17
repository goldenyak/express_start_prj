import {videos} from "./db";

export const videosRepository = {
    getVideos() {

    },
    getVideoById(videoId: number) {
        const videoById = videos.find(el => el.id === videoId)
        if (videoById) {
            return videoById;
        } else {
            return videos
        }
    },
    deleteVideoById(id: number) {

    },
    updateVideoById(id: number, title: string) {

    },
    createVideo(ititle: string) {

    }
}