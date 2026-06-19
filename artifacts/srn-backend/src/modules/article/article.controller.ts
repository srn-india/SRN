import { Request, Response } from 'express';
import { articleService } from './article.service';
import { uploadToSupabase } from '../../utils/upload';

export const submitArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      authorName,
      email,
      phone,
      articleCategory,
      title,
      summary,
      content,
    } = req.body;

    const userId = req.user?.id; // Assumes protect middleware

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    let coverImageUrl: string | undefined;

    if (req.file) {
      const publicUrl = await uploadToSupabase(req.file, 'complaints', 'articles');
      if (publicUrl) {
        coverImageUrl = publicUrl;
      }
    }

    const article = await articleService.createArticle({
      userId,
      authorName,
      email,
      phone,
      articleCategory,
      title,
      summary,
      content,
      coverImageUrl,
    });

    res.status(201).json({
      message: 'Article submitted successfully',
      data: article,
    });
  } catch (error: any) {
    console.error('Error submitting article:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await articleService.getAllArticles();
    res.status(200).json({ data: articles });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
};

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const article = await articleService.getArticleById(id);
    if (!article) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }
    res.status(200).json({ data: article });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching article', error: error.message });
  }
};

export const approveArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const article = await articleService.updateStatus(id, 'APPROVED');
    res.status(200).json({ message: 'Article approved successfully', data: article });
  } catch (error: any) {
    res.status(500).json({ message: 'Error approving article', error: error.message });
  }
};

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await articleService.deleteArticle(id);
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting article', error: error.message });
  }
};
