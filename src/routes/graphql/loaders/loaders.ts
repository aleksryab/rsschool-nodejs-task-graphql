import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';
import { User } from '../types/user.js';
import { Profile } from '../types/profile.js';
import { Post } from '../types/post.js';
import { Member } from '../types/member.js';

export const createDataLoaders = (prisma: PrismaClient) => {
  return {
    profile: new DataLoader(async (ids: readonly string[]) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: ids as string[] } },
      });

      const profilesMap = {} as Record<string, Profile>;
      profiles.forEach((profile) => (profilesMap[profile.userId] = profile));

      return ids.map((id) => profilesMap[id]);
    }),

    posts: new DataLoader(async (ids: readonly string[]) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: ids as string[] } },
      });

      const postsMap = {} as Record<string, Post[]>;
      posts.forEach((post) => {
        if (postsMap[post.authorId]) {
          postsMap[post.authorId].push(post);
        } else {
          postsMap[post.authorId] = [post];
        }
      });

      return ids.map((id) => postsMap[id]);
    }),

    memberType: new DataLoader(async (ids: readonly string[]) => {
      const members = await prisma.memberType.findMany({
        where: { id: { in: ids as string[] } },
      });

      const membersMap = {} as Record<string, Member>;
      members.forEach((member) => (membersMap[member.id] = member));

      return ids.map((id) => membersMap[id]);
    }),

    user: new DataLoader(async (ids: readonly string[]) => {
      const users = await prisma.user.findMany({
        where: { id: { in: ids as string[] } },
        include: { userSubscribedTo: true, subscribedToUser: true },
      });

      const usersMap = {} as Record<string, User>;
      users.forEach((user) => (usersMap[user.id] = user));

      return ids.map((id) => usersMap[id]);
    }),
  };
};

export type LoadersMap = ReturnType<typeof createDataLoaders>;
