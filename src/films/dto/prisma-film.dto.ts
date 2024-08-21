export class filmPrismaObj {
    id: number | string;
    title: string;
    description: string;
    director: string;
    release_year: number;
    genre: string[];
    price: number;
    duration: number;
    video_url: string;
    cover_image_url: string;
    created_at: Date;
    updated_at: Date;
}