import { CanvasRenderingContext2D, loadImage } from 'canvas';
import fs from 'fs';
import { prisma } from '../lib/prisma';
import { supabase } from '../lib/supabase';
import { generateAndUploadIdCard } from '../modules/membership/idcard.service';

jest.mock('../lib/prisma', () => ({ prisma: { membership: { findUnique: jest.fn() } } }));
jest.mock('../lib/supabase', () => ({ supabase: { storage: { from: jest.fn() } } }));
const upload = jest.fn().mockResolvedValue({ error: null });
const member = { id: '12345678-test', status: 'ACTIVE', user: { firstName: 'K K CHAUDHARY', lastName: 'BHOLA PAHALWAN', phone: '9876543210', avatar: 'missing-test-avatar.png' } };
let textDraws: { text: string; x: number; width: number; font: string }[];

beforeEach(() => {
  textDraws = [];
  upload.mockClear();
  (prisma.membership.findUnique as jest.Mock).mockResolvedValue(member);
  (supabase.storage.from as jest.Mock).mockReturnValue({ upload, getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/id.png' } }) });
  const original = CanvasRenderingContext2D.prototype.fillText;
  jest.spyOn(CanvasRenderingContext2D.prototype, 'fillText').mockImplementation(function (this: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth?: number) {
    textDraws.push({ text, x, width: this.measureText(text).width, font: this.font });
    if (maxWidth === undefined) original.call(this, text, x, y);
    else original.call(this, text, x, y, maxWidth);
  });
});

test.each([
  ['K K CHAUDHARY', 'BHOLA PAHALWAN'],
  ['ANEXCEPTIONALLYLONGUNBROKENMEMBERNAME', ''],
  ['Rahul', 'Sharma'],
])('renders the complete name %s %s before the photo without changing other fields', async (firstName, lastName) => {
  (prisma.membership.findUnique as jest.Mock).mockResolvedValue({ ...member, user: { ...member.user, firstName, lastName } });
  const url = await generateAndUploadIdCard(member.id);
  expect(url).toBe('https://example.com/id.png');
  const buffer = upload.mock.calls[0][1] as Buffer;
  const image = await loadImage(buffer);
  const name = textDraws.find(draw => draw.text === [firstName, lastName].filter(Boolean).join(' '))!;
  expect(name).toBeDefined();
  const photoLeft = image.width * (0.84 - 0.138);
  expect(name.x + name.width).toBeLessThanOrEqual(photoLeft - 19);
  expect(textDraws.find(draw => draw.text === '98******10')?.font).toContain('38px');
  expect(textDraws.find(draw => draw.text === '12****78')?.font).toContain('38px');
  if (firstName === 'Rahul') expect(name.font).toContain('38px');
  if (firstName === 'K K CHAUDHARY') fs.writeFileSync('/private/tmp/srn-long-name-id-card.png', buffer);
});
