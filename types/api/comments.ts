import { User } from "./user";

export interface Comment {
  id: number;
  message: string;
  userId: number;
  postId: number;
  createdAt: string;
  user: User;
}
