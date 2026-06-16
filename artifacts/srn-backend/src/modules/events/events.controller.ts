import { Request, Response } from 'express';
import * as eventsService from './events.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess, sendError } from '../../utils/response';

import { uploadToSupabase } from '../../utils/upload';

export const createEvent = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    const imageUrl = await uploadToSupabase(req.file, 'complaints', 'events');
    req.body.imageUrl = imageUrl;
  }
  const event = await eventsService.createEvent(req.body);
  sendSuccess(res, event, 'Event created successfully', 201);
});

export const getEvents = catchAsync(async (req: Request, res: Response) => {
  const events = await eventsService.getEvents();
  sendSuccess(res, events, 'Events fetched successfully');
});

export const getEventById = catchAsync(async (req: Request, res: Response) => {
  const event = await eventsService.getEventById(req.params.id as string);
  sendSuccess(res, event, 'Event fetched successfully');
});

export const registerForEvent = catchAsync(async (req: Request, res: Response) => {
  const registration = await eventsService.registerForEvent(req.params.id as string, req.user.id);
  sendSuccess(res, registration, 'Registered successfully');
});

export const getAttendees = catchAsync(async (req: Request, res: Response) => {
  const attendees = await eventsService.getEventAttendees(req.params.id as string);
  sendSuccess(res, attendees, 'Event attendees retrieved successfully');
});

export const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  await eventsService.deleteEvent(req.params.id as string);
  sendSuccess(res, null, 'Event deleted successfully');
});
