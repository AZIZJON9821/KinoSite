interface Category {
  id: string;
  name: string;
}

interface PostCategory {
  id: string;
  postId: string;
  categoryId: string;
  createdAt: string;
  category: Category;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  githubURL: string;
}

interface ReactionUser {
  id: string;
  username: string;
}

interface Reaction {
  id: string;
  like: number;
  dislike: number;
  userId: string;
  postId: string;
  createdAt: string;
  User: ReactionUser;
}

interface ReactionSummary {
  totalLikes: number;
  totalDislikes: number;
  totalReactions: number;
}

export interface UserPosts {
  id: string;
  title: string;
  code: string;
  userId: string;
  createdAt: string;
  user: User;
  PostCategory: PostCategory[];
  comments: Comment[];
  reactions: Reaction[];
  summary: ReactionSummary;
}
