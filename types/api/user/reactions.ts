export interface User {
  id: string;
  username: string;
}

interface Category {
  id: string;
  name: string;
}

export interface PostCategory {
  id: string;
  category: Category;
}

export interface Post {
  id: string;
  title: string;
  code: string;
  createdAt: string; 
  user: User;
  PostCategory: PostCategory[];
}

export interface ReactionData {
  id: string;
  like: number;
  dislike: number;
  userId: string;
  postId: string;
  createdAt: string;
  Post: Post;
}
