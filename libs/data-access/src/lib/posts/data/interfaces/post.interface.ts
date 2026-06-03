import { Profile } from '../../../profile/data';

export interface PostCreateDto {
  title: string;
  content: string;
  authorId: number;
  communityId?: number | null;
}

export interface Post {
  id: number;
  title: string;
  communityId?: number | null;
  content: string;
  author: Profile;
  images: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  likesUsers: string[];
  comments: PostComment[];
}

export interface PostComment {
  id: number;
  text: string;
  author: {
    id: number;
    username: string;
    avatarUrl: string;
    subscribersAmount: number;
    firstName: string;
    lastName: string;
    isActive: boolean;
    stack: string[];
    city: string;
    description: string;
  };
  postId: number;
  commentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateDto {
  text: string;
  authorId: number;
  postId: number;
  commentId: number;
}
