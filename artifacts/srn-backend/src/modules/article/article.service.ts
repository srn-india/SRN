import { prisma } from '../../lib/prisma';

export const articleService = {
  createArticle: async (data: {
    userId: string;
    authorName: string;
    email: string;
    phone: string;
    articleCategory: string;
    title: string;
    summary: string;
    content: string;
    coverImageUrl?: string;
  }) => {
    return prisma.janmantArticle.create({
      data,
    });
  },

  getAllArticles: async () => {
    return prisma.janmantArticle.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  },

  getArticleById: async (id: string) => {
    return prisma.janmantArticle.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  },

  updateStatus: async (id: string, status: string) => {
    return prisma.janmantArticle.update({
      where: { id },
      data: { status },
    });
  },

  deleteArticle: async (id: string) => {
    return prisma.janmantArticle.delete({
      where: { id },
    });
  },
};
