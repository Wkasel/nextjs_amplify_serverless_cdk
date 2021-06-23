import Post from './Post';
declare function createPost(post: Post, username: string): Promise<{
    owner: string;
    id: string;
    title: string;
    content: string;
} | null>;
export default createPost;
