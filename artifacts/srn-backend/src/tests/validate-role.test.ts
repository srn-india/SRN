import { z } from 'zod';
import { validate } from '../middleware/validate';
import { restrictTo } from '../middleware/role';

describe('validate middleware', () => {
  const createMockRes = () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    return { status, json };
  };

  it('calls next for valid payload', async () => {
    const schema = z.object({
      body: z.object({ name: z.string().min(1) }),
      query: z.any(),
      params: z.any(),
    });

    const req = { body: { name: 'Alice' }, query: {}, params: {} };
    const res = createMockRes();
    const next = jest.fn();

    await validate(schema)(req as any, res as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 with zod issue messages when invalid', async () => {
    const schema = z.object({
      body: z.object({ name: z.string().min(3, 'name too short') }),
      query: z.any(),
      params: z.any(),
    });

    const req = { body: { name: 'Al' }, query: {}, params: {} };
    const res = createMockRes();
    const next = jest.fn();

    await validate(schema)(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'name too short',
      }),
    );
  });

  it('returns generic validation failure for non-zod errors', async () => {
    const schema = {
      parseAsync: jest.fn().mockRejectedValue(new Error('unexpected')),
    } as any;

    const req = { body: {}, query: {}, params: {} };
    const res = createMockRes();
    const next = jest.fn();

    await validate(schema)(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Validation failed'),
      }),
    );
  });
});

describe('restrictTo middleware', () => {
  const createMockRes = () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    return { status, json };
  };

  it('blocks request when user is missing', () => {
    const middleware = restrictTo('ADMIN');
    const req = {};
    const res = createMockRes();
    const next = jest.fn();

    middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('blocks request for disallowed role', () => {
    const middleware = restrictTo('ADMIN');
    const req = { user: { role: 'USER' } };
    const res = createMockRes();
    const next = jest.fn();

    middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('allows request for allowed role', () => {
    const middleware = restrictTo('ADMIN', 'MEMBER');
    const req = { user: { role: 'MEMBER' } };
    const res = createMockRes();
    const next = jest.fn();

    middleware(req as any, res as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
