import { prisma } from '../../lib/prisma';
import * as notificationService from '../notification/notification.service';

export const createThread = async (data: any, userId: string) => {
// ... existing code
  return await prisma.forumThread.create({
    data: {
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl,
      userId,
    },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
    },
  });
};

export const getThreads = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const [threads, total] = await Promise.all([
    prisma.forumThread.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.forumThread.count(),
  ]);

  return {
    threads,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getThreadById = async (id: string) => {
  const thread = await prisma.forumThread.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      comments: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!thread) throw new Error('Thread not found');
  return thread;
};

export const deleteThread = async (id: string) => {
  return await prisma.forumThread.delete({
    where: { id },
  });
};

export const createComment = async (data: any, threadId: string, userId: string) => {
  const thread = await prisma.forumThread.findUnique({ 
    where: { id: threadId },
    include: { user: true }
  });
  if (!thread) throw new Error('Thread not found');

  const comment = await prisma.forumComment.create({
    data: {
      content: data.content,
      threadId,
      userId,
    },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
    },
  });

  // Notify thread author
  if (thread.userId !== userId) {
    await notificationService.createNotification(
      thread.userId,
      'New Comment on your Thread',
      `${comment.user.firstName} ${comment.user.lastName} commented on your thread: "${thread.title}"`
    );
  }

  return comment;
};
