import { User } from "./user";

export interface Like {
  id: number;
  like: number;
  dislike: number;
  userId: number;
  postId: number;
  createdAt: string;
  User: User;
}
