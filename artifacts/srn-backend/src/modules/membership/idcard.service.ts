import { prisma } from '../../lib/prisma';
import { supabase } from '../../lib/supabase';
import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';

export const generateAndUploadIdCard = async (membershipId: string) => {
  try {
    const membership = await prisma.membership.findUnique({
      where: { id: membershipId },
      include: { user: true }
    });

    if (!membership || membership.status !== 'ACTIVE') {
      console.error(`Cannot generate ID card for membership ${membershipId}: Not active or not found.`);
      return null;
    }

    const templatePath = path.join(process.cwd(), 'src/assets/id-card.jpeg');
    const image = await loadImage(templatePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, image.width, image.height);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px "Open Sans", Arial';

    const valueX = image.width * 0.35;
    const nameY = image.height * 0.565;
    const phoneY = image.height * 0.68;
    const idX = image.width * 0.38;
    const idY = image.height * 0.79;

    ctx.fillText(membership.user.firstName + ' ' + membership.user.lastName, valueX, nameY);
    
    const phone = membership.user.phone || 'N/A';
    const displayPhone = phone !== 'N/A' && phone.length >= 6
      ? phone.slice(0, 2) + '*'.repeat(phone.length - 4) + phone.slice(-2)
      : phone;
    ctx.fillText(displayPhone, valueX, phoneY);

    const rawDisplayId = membership.id.split('-')[0].toUpperCase();
    const displayId = rawDisplayId.length >= 6
      ? rawDisplayId.slice(0, 2) + '*'.repeat(rawDisplayId.length - 4) + rawDisplayId.slice(-2)
      : rawDisplayId;
    ctx.fillText(displayId, idX, idY);

    const avatarRadius = image.width * 0.138;
    const avatarX = image.width * 0.84;
    const avatarY = image.height * 0.43;

    try {
      let avatarImage = null;
      const avatarUrl = membership.user.avatar || 'https://i.pravatar.cc/300';
      if (avatarUrl) {
        if (avatarUrl.startsWith('http')) {
          avatarImage = await loadImage(avatarUrl);
        } else {
          const localPath = path.join(process.cwd(), 'uploads', avatarUrl);
          if (fs.existsSync(localPath)) {
            avatarImage = await loadImage(localPath);
          }
        }
      }
      
      if (avatarImage) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImage, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        ctx.restore();
      }
    } catch (err) {
      console.error('Failed to draw avatar:', err);
    }

    // Pre-calculate Supabase public URL with download option
    const { data: publicUrlData } = supabase.storage
      .from('id-cards')
      .getPublicUrl(`${membership.id}.png`, {
        download: `ID_${membership.user.firstName}_${membership.user.lastName}.png`
      });
      
    const qrData = publicUrlData.publicUrl;
    
    const qrCodeCanvas = createCanvas(170, 170);
    await QRCode.toCanvas(qrCodeCanvas, qrData, { width: 170, margin: 1 });
    
    const qrX = image.width - 220;
    const qrY = image.height - 245;
    
    ctx.drawImage(qrCodeCanvas, qrX, qrY, 170, 170);

    const buffer = canvas.toBuffer('image/png');

    const { data, error } = await supabase.storage
      .from('id-cards')
      .upload(`${membership.id}.png`, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Error uploading ID card to Supabase:', error);
      return null;
    }

    console.log(`Successfully generated and uploaded ID card for membership ${membership.id}`);
    return publicUrlData.publicUrl;

  } catch (error) {
    console.error('Error generating ID card:', error);
    return null;
  }
};
