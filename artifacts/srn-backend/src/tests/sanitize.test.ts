import { sanitizeInput } from '../middleware/sanitize';

describe('input sanitization middleware', () => {
  it('should strip HTML and script tags from req.body strings', () => {
    const req: any = {
      body: {
        title: 'Hello <script>alert("XSS")</script>World',
        description: '<p>Paragraph</p> <strong>Bold</strong>',
        numberVal: 42,
        nested: {
          comment: 'Click <a href="http://malicious.com">here</a>',
          list: ['<b>Item 1</b>', 'Item 2'],
        },
      },
    };
    const res: any = {};
    const next = jest.fn();

    sanitizeInput(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body.title).toBe('Hello World');
    expect(req.body.description).toBe('Paragraph Bold');
    expect(req.body.numberVal).toBe(42);
    expect(req.body.nested.comment).toBe('Click here');
    expect(req.body.nested.list).toEqual(['Item 1', 'Item 2']);
  });

  it('should pass through if req.body is undefined', () => {
    const req: any = {};
    const res: any = {};
    const next = jest.fn();

    sanitizeInput(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toBeUndefined();
  });
});
