import { prisma } from '../../lib/prisma';
import { getCache, setCache } from '../../lib/cache';

export const createEvent = async (data: any) => {
  return await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      date: new Date(data.date),
    },
  });
};

export const getEvents = async () => {
  const CACHE_KEY = 'events:all';
  
  // 1. Try to get events from Redis cache
  const cachedEvents = await getCache(CACHE_KEY);
  if (cachedEvents) {
    return cachedEvents;
  }

  // 2. If not in cache, hit PostgreSQL
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    take: 50, // Pagination limits the amount of data fetched
    select: {
      id: true,
      title: true,
      date: true,
      location: true,
      // intentionally excluding 'description' as it might be large
    }
  });

  // 3. Store the result in Redis for 60 seconds
  await setCache(CACHE_KEY, events, 60);

  return events;
};

export const getEventById = async (id: string) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new Error('Event not found');
  return event;
};

export const registerForEvent = async (eventId: string, userId: string) => {
  // Check if already registered
  const existing = await prisma.eventRegistration.findUnique({
    where: {
      eventId_userId: { eventId, userId },
    },
  });

  if (existing) {
    throw new Error('You are already registered for this event');
  }

  return await prisma.eventRegistration.create({
    data: {
      eventId,
      userId,
    },
    include: {
      event: true,
    },
  });
};

export const getEventAttendees = async (eventId: string) => {
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  return registrations.map((reg: any) => reg.user);
};
