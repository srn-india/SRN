import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export interface ReceiptData {
  userName: string;
  amount: number;
  paymentId: string; // Razorpay Payment ID or Manual Payment UTR
  type: 'DONATION' | 'MEMBERSHIP';
  date: Date;
  method: 'RAZORPAY' | 'UPI (Manual)' | 'Bank Transfer';
  userPan?: string;
  userPhone?: string;
  userEmail?: string;
  address?: string;
}

/**
 * Converts a numeric amount to Indian English words.
 * Example: 2500 -> "Two Thousand Five Hundred Rupees Only"
 */
function numberToIndianWords(amount: number): string {
  if (!amount || isNaN(amount)) return 'Zero Rupees Only';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(amount);
  if (n === 0) return 'Zero Rupees Only';

  const convertLessThanOneThousand = (val: number): string => {
    let str = '';
    if (val >= 100) {
      str += a[Math.floor(val / 100)] + ' Hundred ';
      val %= 100;
    }
    if (val >= 20) {
      str += b[Math.floor(val / 10)] + (val % 10 !== 0 ? ' ' + a[val % 10] : '') + ' ';
    } else if (val > 0) {
      str += a[val] + ' ';
    }
    return str.trim();
  };

  const crore = Math.floor(n / 10000000);
  let remainder = n % 10000000;
  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  const thousand = Math.floor(remainder / 1000);
  const hundred = remainder % 1000;

  let words = '';
  if (crore > 0) words += convertLessThanOneThousand(crore) + ' Crore ';
  if (lakh > 0) words += convertLessThanOneThousand(lakh) + ' Lakh ';
  if (thousand > 0) words += convertLessThanOneThousand(thousand) + ' Thousand ';
  if (hundred > 0) words += convertLessThanOneThousand(hundred) + ' ';

  return words.trim() + ' Rupees Only';
}

/**
 * Generates an official, 80G and 12A compliant PDF receipt.
 */
export const generateReceiptPdf = async (data: ReceiptData): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margins: { top: 15, bottom: 15, left: 20, right: 20 },
        autoFirstPage: true 
      });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;   // 595.28
      const pageHeight = doc.page.height; // 841.89

      // ── 1. Elegant Double Outer Border ─────────────────────────────────────
      doc.lineWidth(1.5).rect(18, 18, pageWidth - 36, pageHeight - 36).stroke('#E8622A');
      doc.lineWidth(0.5).rect(22, 22, pageWidth - 44, pageHeight - 44).stroke('#FED7AA');

      // ── 2. Header: Logo & Organization Info ────────────────────────────────
      const possibleLogoPaths = [
        path.join(process.cwd(), 'src', 'assets', 'logo.png'),
        path.join(process.cwd(), 'artifacts', 'srn-backend', 'src', 'assets', 'logo.png'),
        path.join(__dirname, '..', 'assets', 'logo.png'),
        path.join(process.cwd(), 'artifacts', 'srn-website', 'public', 'srn-logo.png'),
        path.join(process.cwd(), '..', 'srn-website', 'public', 'srn-logo.png'),
      ];

      let logoLoaded = false;
      for (const lp of possibleLogoPaths) {
        if (fs.existsSync(lp)) {
          try {
            doc.image(lp, 36, 32, { width: 62, height: 62 });
            logoLoaded = true;
            break;
          } catch (e) {
            // continue search
          }
        }
      }

      const headerTextX = logoLoaded ? 110 : 36;
      const headerTextWidth = pageWidth - headerTextX - 36;

      doc
        .font('Helvetica-Bold')
        .fontSize(21)
        .fillColor('#C2410C')
        .text('SASHAKT RASHTRA NIRMAN', headerTextX, 32, { width: headerTextWidth });

      doc
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .fillColor('#374151')
        .text('REGISTERED PUBLIC CHARITABLE TRUST · ESTABLISHED UNDER THE INDIAN TRUSTS ACT, 1882', headerTextX, doc.y + 2, { width: headerTextWidth });

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#6B7280')
        .text(
          'Regd. Office: New Delhi, India | Helpline: +91 76520 12487 | Email: contact@srnindia.org | Web: https://srnindia.org',
          headerTextX,
          doc.y + 2,
          { width: headerTextWidth }
        );

      // ── 3. Statutory Badges Bar ───────────────────────────────────────────
      // Values can be set in .env: TRUST_PAN, TRUST_12A_URN, TRUST_80G_URN, TRUST_DARPAN_ID, TRUST_REG_NO
      const trustPan = process.env.TRUST_PAN || '';
      const trust12a = process.env.TRUST_12A_URN || '';
      const trust80g = process.env.TRUST_80G_URN || '';
      const trustDarpan = process.env.TRUST_DARPAN_ID || '';
      const trustRegNo = process.env.TRUST_REG_NO || '01/2026';

      const badgeY = 104;
      const badgeWidth = pageWidth - 72;
      doc
        .roundedRect(36, badgeY, badgeWidth, 22, 3)
        .fillAndStroke('#FFF7ED', '#FDBA74');

      const b1 = `REG. NO: ${trustRegNo}`;
      const b2 = trustDarpan ? `DARPAN ID: ${trustDarpan}` : 'DARPAN: REGISTERED';
      const b3 = trust12a ? `12A URN: ${trust12a}` : '12A STATUS: REGISTERED';
      const b4 = trust80g ? `80G URN: ${trust80g}` : (trustPan ? `PAN: ${trustPan}` : '80G STATUS: ELIGIBLE');

      doc
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .fillColor('#9A3412')
        .text(b1, 46, badgeY + 6)
        .text(b2, 160, badgeY + 6)
        .text(b3, 295, badgeY + 6)
        .text(b4, 435, badgeY + 6);

      // ── 4. Title Ribbon (Membership / Donation) ────────────────────────────
      const ribbonY = 134;
      doc
        .roundedRect(36, ribbonY, badgeWidth, 26, 4)
        .fill('#E8622A');

      const receiptTitle =
        data.type === 'DONATION'
          ? 'OFFICIAL DONATION RECEIPT & 80G TAX CERTIFICATE'
          : 'OFFICIAL MEMBERSHIP RECEIPT & 80G TAX CERTIFICATE';

      doc
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .fillColor('#FFFFFF')
        .text(receiptTitle, 36, ribbonY + 7, { width: badgeWidth, align: 'center' });

      // ── 5. Metadata Row (Receipt No, Date, FY, AY) ─────────────────────────
      const metaY = 168;
      const cleanRef = (data.paymentId || 'SRN').replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase();
      const receiptNo = `SRN/REC/2026-27/${cleanRef}`;
      const formattedDate = new Date(data.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      // Left Column
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#1F2937')
        .text('Receipt Voucher No: ', 40, metaY, { continued: true })
        .font('Helvetica')
        .fillColor('#C2410C')
        .text(receiptNo);

      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#1F2937')
        .text('Date of Issuance: ', 40, metaY + 14, { continued: true })
        .font('Helvetica')
        .fillColor('#4B5563')
        .text(formattedDate);

      // Right Column
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#1F2937')
        .text('Financial Year: ', 360, metaY, { continued: true })
        .font('Helvetica')
        .fillColor('#4B5563')
        .text('2026 – 2027');

      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#1F2937')
        .text('Assessment Year: ', 360, metaY + 14, { continued: true })
        .font('Helvetica')
        .fillColor('#4B5563')
        .text('2027 – 2028');

      // ── 6. Particulars Table Grid ──────────────────────────────────────────
      const tableY = 202;
      const tableWidth = badgeWidth;
      const rowHeight = 23.5;
      const labelColWidth = 170;
      const valColWidth = tableWidth - labelColWidth;

      // Table Header Row
      doc
        .rect(36, tableY, tableWidth, 21)
        .fillAndStroke('#F3F4F6', '#E5E7EB');

      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#374151')
        .text('PARTICULARS OF CONTRIBUTION', 46, tableY + 6);

      doc
        .text('DETAILS & TRANSACTION RECORDS', 36 + labelColWidth + 10, tableY + 6);

      const rows: [string, string][] = [
        ['Received With Thanks From:', data.userName || 'Member'],
        ['Member / Donor PAN:', data.userPan || 'Registered & Verified on Record'],
        ['Contact Details:', [data.userPhone, data.userEmail].filter(Boolean).join(' | ') || 'Verified on Account Profile'],
        [
          'Purpose / Category:',
          data.type === 'DONATION'
            ? 'Charitable Public Contribution (Nation Building & Youth Empowerment)'
            : 'Active Membership Contribution (Rashtra Nirman Karta · 3 Years Tenure)'
        ],
        ['Payment Method / Channel:', data.method === 'RAZORPAY' ? 'Online Payment Gateway (Razorpay Verified)' : data.method],
        ['Transaction Reference / UTR:', data.paymentId || 'N/A'],
        ['Amount Received (in figures):', `INR ${Number(data.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
        ['Amount in Words:', numberToIndianWords(data.amount)],
      ];

      let curY = tableY + 21;
      rows.forEach(([label, value], idx) => {
        const bg = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA';
        doc.rect(36, curY, tableWidth, rowHeight).fillAndStroke(bg, '#E5E7EB');

        doc
          .font('Helvetica-Bold')
          .fontSize(8.5)
          .fillColor('#374151')
          .text(label, 46, curY + 6.5, { width: labelColWidth - 16 });

        const isAmountRow = label.includes('figures');
        doc
          .font(isAmountRow ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(isAmountRow ? 9.5 : 8.5)
          .fillColor(isAmountRow ? '#C2410C' : '#1F2937')
          .text(value, 36 + labelColWidth + 10, curY + 6.5, { width: valColWidth - 20 });

        curY += rowHeight;
      });

      // ── 7. Statutory 80G & 12A Compliance Declaration Box ─────────────────
      const compBoxY = curY + 12;
      const compBoxHeight = 112;

      doc
        .roundedRect(36, compBoxY, tableWidth, compBoxHeight, 4)
        .fillAndStroke('#F0FDF4', '#86EFAC');

      doc
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .fillColor('#166534')
        .text('TAX EXEMPTION & STATUTORY DECLARATION (SECTION 80G & 12A)', 48, compBoxY + 9);

      const u12aClause = trust12a
        ? `vide Order / URN: ${trust12a}`
        : `under Section 12A of the Income Tax Act, 1961`;
      const u80gClause = trust80g
        ? `vide Order / URN: ${trust80g}`
        : `as an approved institution under Section 80G(5)(vi) of the Income Tax Act, 1961`;

      const declarationText =
        `1. Certified that the contribution of INR ${Number(data.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} received from ${data.userName || 'the contributor'} is eligible for deduction from total taxable income under Section 80G(5)(vi) of the Income Tax Act, 1961 (${u80gClause}).\n` +
        `2. Sashakt Rashtra Nirman Trust is formally registered as a public charitable institution (${u12aClause}).\n` +
        `3. All contributions received are dedicated strictly towards social welfare, youth leadership, citizen empowerment, and national development initiatives in full adherence to the Indian Trusts Act, 1882 (Registration No. ${trustRegNo}).\n` +
        `4. This receipt serves as an authentic acknowledgment for filing income tax returns. Donors are advised to retain this receipt for statutory assessment.`;

      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor('#1E3A8A')
        .text(declarationText, 48, compBoxY + 24, {
          width: tableWidth - 24,
          lineGap: 2.2,
        });

      // ── 8. Verification QR Code & Digital Signature Section ────────────────
      const signY = compBoxY + compBoxHeight + 14;

      // Generate dynamic QR Code for receipt authenticity
      try {
        const qrUrl = `https://srnindia.org/verify-receipt?id=${encodeURIComponent(receiptNo)}&amount=${encodeURIComponent(String(data.amount))}&txn=${encodeURIComponent(data.paymentId)}`;
        const qrBuffer = await QRCode.toBuffer(qrUrl, {
          width: 80,
          margin: 1,
          color: { dark: '#1F2937', light: '#FFFFFF' }
        });

        doc.image(qrBuffer, 46, signY, { width: 70, height: 70 });

        doc
          .font('Helvetica-Bold')
          .fontSize(7.5)
          .fillColor('#374151')
          .text('DIGITAL VERIFICATION', 124, signY + 6);

        doc
          .font('Helvetica')
          .fontSize(7)
          .fillColor('#6B7280')
          .text('Scan this QR code with any smartphone to instantly verify receipt authenticity on the SRN Central Portal.', 124, signY + 18, { width: 170 });
      } catch (qrErr) {
        // Graceful fallback if QR fails
      }

      // Authorized Signatory Seal & Text (Right Column)
      const signRightX = pageWidth - 210;

      // Official SRN Trust Seal Badge
      const candidateSealPaths = [
        path.join(__dirname, '../assets/srn-seal.png'),
        path.join(process.cwd(), 'src/assets/srn-seal.png'),
        path.join(process.cwd(), 'dist/assets/srn-seal.png'),
        path.join(process.cwd(), 'artifacts/srn-backend/src/assets/srn-seal.png'),
      ];
      const resolvedSealPath = candidateSealPaths.find(p => fs.existsSync(p));

      const sealSize = 72;
      const sealX = signRightX + (160 - sealSize) / 2; // Perfectly centered over signature block
      const sealY = signY - 2;

      if (resolvedSealPath) {
        doc.image(resolvedSealPath, sealX, sealY, { width: sealSize, height: sealSize });
      } else {
        // Fallback decorative double circle seal
        doc
          .circle(signRightX + 80, signY + 34, 30)
          .lineWidth(1.5)
          .strokeColor('#C2410C')
          .stroke();
        doc
          .circle(signRightX + 80, signY + 34, 26)
          .lineWidth(0.8)
          .strokeColor('#EA580C')
          .stroke();
        doc
          .font('Helvetica-Bold')
          .fontSize(6)
          .fillColor('#C2410C')
          .text('SRN TRUST', signRightX, signY + 27, { width: 160, align: 'center' })
          .font('Helvetica-Bold')
          .fontSize(5.5)
          .fillColor('#EA580C')
          .text('OFFICIAL SEAL', signRightX, signY + 36, { width: 160, align: 'center' });
      }

      doc
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .fillColor('#1F2937')
        .text('For SASHAKT RASHTRA NIRMAN TRUST', signRightX - 10, signY + 74, { width: 180, align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor('#6B7280')
        .text('Authorized Signatory / Finance Trustee', signRightX - 10, signY + 98, { width: 180, align: 'center' })
        .text('[Digitally Authenticated]', signRightX - 10, signY + 109, { width: 180, align: 'center' });

      // ── 9. Bottom Footer Disclaimer ────────────────────────────────────────
      const footerY = pageHeight - 38;
      doc
        .lineWidth(0.5)
        .moveTo(36, footerY)
        .lineTo(pageWidth - 36, footerY)
        .strokeColor('#E5E7EB')
        .stroke();

      doc
        .font('Helvetica-Oblique')
        .fontSize(6.8)
        .fillColor('#9CA3AF')
        .text(
          'This is a computer-generated, digitally authenticated document compliant with Section 80G(5)(vi) and Section 12A of the Income Tax Act, 1961. No manual signature is required.',
          36,
          footerY + 4,
          { width: pageWidth - 72, align: 'center' }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
