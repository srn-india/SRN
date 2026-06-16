import { Request, Response } from 'express';
import * as applicationService from './application.service';
import { uploadToSupabase } from '../../utils/upload';
import { createApplicationSchema, updateApplicationStatusSchema } from './application.schema';

export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createApplicationSchema.parse(req.body);
    const userId = req.user?.id; // Assumes optional authentication

    let resumeUrl = null;
    if (req.file) {
      resumeUrl = await uploadToSupabase(req.file, 'complaints', 'resumes');
    }

    const application = await applicationService.createApplication({
      ...data,
      resumeUrl,
      ...(userId ? { userId } : {})
    });

    res.status(201).json({ success: true, data: application });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await applicationService.getAllApplications();
    res.status(200).json({ success: true, data: applications });
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getMyApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await applicationService.getMyApplication(req.user.id);
    if (!application) {
      res.status(200).json({ success: true, data: null });
      return;
    }
    res.status(200).json({ success: true, data: application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await applicationService.getApplicationById(req.params.id as string);
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }
    res.status(200).json({ success: true, data: application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = updateApplicationStatusSchema.parse(req.body);
    const updatedApplication = await applicationService.updateApplicationStatus(req.params.id as string, status);
    res.status(200).json({ success: true, data: updatedApplication });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    await applicationService.deleteApplication(req.params.id as string);
    res.status(200).json({ success: true, message: 'Application deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
