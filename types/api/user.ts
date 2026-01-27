import { Comment } from "./comments";
import { Like } from "./likes";
import { Post } from "./post";

export interface User {
  id: number;
  username: string;
  email: string;
  githubURL: string;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
    likes: number;
  };
  posts: Post;
  comments: Comment;
  likes: Like;
}
