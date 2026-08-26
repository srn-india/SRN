import PDFDocument from 'pdfkit';

export interface ReceiptData {
  userName: string;
  amount: number;
  paymentId: string; // Razorpay Payment ID or Manual Payment UTR
  type: 'DONATION' | 'MEMBERSHIP';
  date: Date;
  method: 'RAZORPAY' | 'UPI (Manual)';
}

export const generateReceiptPdf = async (data: ReceiptData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);

      // Add a double border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#E8622A');
      doc.rect(22, 22, doc.page.width - 44, doc.page.height - 44).stroke('#E8622A');

      // Logo
      const logoPath = '/Users/anshjohnson/SRN/artifacts/srn-website/public/srn-logo.png';
      try {
        doc.image(logoPath, (doc.page.width - 100) / 2, 40, { width: 100 });
        doc.moveDown(7); 
      } catch (e) {
        doc.moveDown(3);
      }
      
      // Header Text
      doc
        .fontSize(28)
        .font('Helvetica-Bold')
        .fillColor('#E8622A')
        .text('SASHAKT RASHTRA NIRMAN', { align: 'center' });
      
      doc
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#666666')
        .text('Building a stronger, empowered India', { align: 'center' })
        .moveDown(2);

      // Title
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .fillColor('#333333')
        .text(data.type === 'DONATION' ? 'OFFICIAL DONATION RECEIPT' : 'OFFICIAL MEMBERSHIP RECEIPT', { align: 'center' })
        .moveDown(2);

      // Divider
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#dddddd').stroke().moveDown(2);

      // Details Box
      const startX = 70;
      let currentY = doc.y + 10;
      const rowHeight = 35;

      doc.fontSize(12).fillColor('#444444');

      const printRow = (label: string, value: string) => {
        doc.font('Helvetica-Bold').text(label, startX, currentY);
        doc.font('Helvetica').text(value, startX + 150, currentY);
        currentY += rowHeight;
      };

      printRow('Date:', new Date(data.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }));
      printRow('Received From:', data.userName);
      printRow('Amount:', `INR ${data.amount.toFixed(2)}`);
      printRow('Transaction ID:', data.paymentId);
      printRow('Payment Method:', data.method);
      printRow('Status:', 'SUCCESSFUL');

      // Divider
      currentY += 10;
      doc.moveTo(50, currentY).lineTo(545, currentY).strokeColor('#dddddd').stroke();

      // Footer
      currentY += 40;
      doc.y = currentY;
      doc
        .fontSize(11)
        .font('Helvetica-Oblique')
        .fillColor('#555555')
        .text(
          data.type === 'DONATION'
            ? 'Thank you for your generous donation. Your contribution empowers youth and helps build a stronger India.'
            : 'Thank you for becoming a member. We are excited to have you in the SRN family!',
          { align: 'center' }
        );

      doc.moveDown(4);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('Authorized Signatory', 50, doc.y, { align: 'right', width: 495 });
      doc.fontSize(10).font('Helvetica').fillColor('#888888').text('Sashakt Rashtra Nirman', 50, doc.y + 5, { align: 'right', width: 495 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
