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

      const profilesMap = new Map<string, Profile>();
      profiles.forEach((profile) => profilesMap.set(profile.userId, profile));

      return ids.map((id) => profilesMap.get(id));
    }),

    posts: new DataLoader(async (ids: readonly string[]) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: ids as string[] } },
      });

      const postsMap = new Map<string, Post[]>();
      posts.forEach((post) => {
        const postsByAuthor = postsMap.get(post.authorId);
        if (postsByAuthor) {
          postsByAuthor.push(post);
        } else {
          postsMap.set(post.authorId, [post]);
        }
      });

      return ids.map((id) => postsMap.get(id));
    }),

    memberType: new DataLoader(async (ids: readonly string[]) => {
      const members = await prisma.memberType.findMany({
        where: { id: { in: ids as string[] } },
      });

      const membersMap = new Map<string, Member>();
      members.forEach((member) => membersMap.set(member.id, member));

      return ids.map((id) => membersMap.get(id));
    }),

    user: new DataLoader(async (ids: readonly string[]) => {
      const users = await prisma.user.findMany({
        where: { id: { in: ids as string[] } },
        include: { userSubscribedTo: true, subscribedToUser: true },
      });

      const usersMap = new Map<string, User>();
      users.forEach((user) => usersMap.set(user.id, user));

      return ids.map((id) => usersMap.get(id));
    }),
  };
};

export type LoadersMap = ReturnType<typeof createDataLoaders>;
