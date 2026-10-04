import { Router, Request, Response } from 'express';
import { store } from '../data/store';

const router = Router();

export interface CopilotActionPlan {
  intent: 'AADHAAR_SMART_LAYOUT' | 'PASSPORT_PHOTO' | 'COMPRESS_IMAGE' | 'COMPRESS_PDF' | 'PDF_MERGE' | 'PRINT_DISPATCH' | 'BUSINESS_INSIGHT' | 'SIGNATURE_CLEANUP' | 'GENERAL_HELP';
  documentType?: 'AADHAAR' | 'PAN' | 'PHOTO' | 'SIGNATURE' | 'PDF' | 'GENERAL_DOC';
  parameters: Record<string, any>;
  title: string;
  explanation: string;
  hindiExplanation: string;
  autoExecute: boolean;
  targetStudioTab?: 'dashboard' | 'new-job' | 'document-studio' | 'photo-studio' | 'pdf-studio' | 'printing' | 'reports';
  dataPayload?: any;
}

// Helper to analyze natural Hinglish/Hindi/English query
export function parseCyberSevaIntent(prompt: string): CopilotActionPlan {
  const p = prompt.toLowerCase().trim();

  // 1. Aadhaar front and back layout
  if ((p.includes('aadhaar') || p.includes('aadhar') || p.includes('adhar')) && 
      (p.includes('front') || p.includes('back') || p.includes('a4') || p.includes('ek page') || p.includes('dono taraf'))) {
    const isColor = p.includes('color') || p.includes('colour') || p.includes('rangin');
    return {
      intent: 'AADHAAR_SMART_LAYOUT',
      documentType: 'AADHAAR',
      parameters: {
        layout: 'FRONT_BACK_STACKED',
        paper: 'A4',
        color: isColor ? 'COLOR' : 'BW',
        copies: 1,
        autoMaskAadhaarNumber: false
      },
      title: 'Aadhaar Smart A4 Print Layout',
      explanation: 'Configuring Front + Back alignment on standard A4 page with auto-deskew.',
      hindiExplanation: 'आधार के दोनों तरफ (Front + Back) को एक A4 पेज पर प्रिंट के लिए सेट किया गया है।',
      autoExecute: true,
      targetStudioTab: 'document-studio'
    };
  }

  // 2. Passport photos (e.g. "8 passport photo bana do", "passport size 16 photo")
  if (p.includes('passport') || (p.includes('photo') && (p.includes('size') || p.includes('bana') || p.includes('sheet') || p.includes('8') || p.includes('16')))) {
    let count = 8;
    if (p.includes('16') || p.includes('solah')) count = 16;
    if (p.includes('4') || p.includes('char')) count = 4;
    if (p.includes('32')) count = 32;

    return {
      intent: 'PASSPORT_PHOTO',
      documentType: 'PHOTO',
      parameters: {
        count,
        dimensions: '35x45 mm',
        paper: 'A4',
        paperType: 'Glossy Photo Paper',
        backgroundColor: 'White',
        addBorderGuides: true
      },
      title: `Generate ${count} Passport Photos Sheet`,
      explanation: `Setting up ${count} passport photos (35x45mm) on A4 sheet with cut lines and white background.`,
      hindiExplanation: `${count} पासपोर्ट साइज फोटो (35x45mm) कटिंग गाइड्स के साथ A4 शीट पर तैयार कर रहे हैं।`,
      autoExecute: true,
      targetStudioTab: 'photo-studio'
    };
  }

  // 3. Compress image / signature (e.g. "photo ko 50 kb kar", "signature 20kb bana do")
  if ((p.includes('kb') || p.includes('compress') || p.includes('size kam')) && (p.includes('photo') || p.includes('image') || p.includes('signature') || p.includes('sign'))) {
    let targetKb = 50;
    const match = p.match(/(\d+)\s*(?:kb|k\.b)/);
    if (match) targetKb = parseInt(match[1]);

    const isSig = p.includes('signature') || p.includes('sign') || p.includes('angutha');

    return {
      intent: isSig ? 'SIGNATURE_CLEANUP' : 'COMPRESS_IMAGE',
      documentType: isSig ? 'SIGNATURE' : 'PHOTO',
      parameters: {
        targetKb,
        removeBackground: isSig,
        contrastBoost: isSig ? 1.4 : 1.1
      },
      title: `${isSig ? 'Signature' : 'Photo'} Compression to ${targetKb} KB`,
      explanation: `Optimizing ${isSig ? 'signature with transparent/white background' : 'image'} to under ${targetKb} KB for government exam portals (SSC/UPSC/State).`,
      hindiExplanation: `सरकारी फॉर्म पोर्टल हेतु फ़ाइल को सटीक ${targetKb} KB के अंदर सेट किया जा रहा है।`,
      autoExecute: true,
      targetStudioTab: 'document-studio'
    };
  }

  // 4. PDF operations (e.g. "PDF merge kar", "page 4 hata do", "PDF 500kb")
  if (p.includes('pdf') || p.includes('merge') || p.includes('split') || p.includes('page hata')) {
    let targetKb = 500;
    const kbMatch = p.match(/(\d+)\s*(?:kb|k\.b)/);
    if (kbMatch) targetKb = parseInt(kbMatch[1]);

    let removePage: number | undefined = undefined;
    const pageMatch = p.match(/page\s*(\d+)/);
    if (pageMatch) removePage = parseInt(pageMatch[1]);

    return {
      intent: 'COMPRESS_PDF',
      documentType: 'PDF',
      parameters: {
        action: p.includes('merge') ? 'MERGE' : (removePage ? 'DELETE_PAGE' : 'COMPRESS'),
        targetKb,
        removePage
      },
      title: removePage ? `Remove Page ${removePage} from PDF` : (p.includes('merge') ? 'Merge PDF Documents' : `Compress PDF to <${targetKb} KB`),
      explanation: removePage ? `Page ${removePage} will be extracted and remaining pages bundled.` : `Optimizing PDF streams to stay under ${targetKb} KB without losing legibility.`,
      hindiExplanation: removePage ? `पेज नंबर ${removePage} हटाया जा रहा है।` : `पीडीएफ को कम्प्रेस और मैनेज करने के लिए PDF Studio लोड किया गया है।`,
      autoExecute: true,
      targetStudioTab: 'pdf-studio'
    };
  }

  // 5. Direct Print Dispatch (e.g. "Black and white mein 5 copies print kar")
  if (p.includes('print') && (p.includes('cop') || p.includes('black') || p.includes('color') || p.includes('kar do'))) {
    let copies = 1;
    const copyMatch = p.match(/(\d+)\s*(?:cop|prati|copy)/);
    if (copyMatch) copies = parseInt(copyMatch[1]);

    const isColor = p.includes('color') || p.includes('colour') || p.includes('rangin');
    const printer = isColor ? store.printers.find(p => p.type.includes('Color')) : store.printers.find(p => p.type.includes('Mono'));

    return {
      intent: 'PRINT_DISPATCH',
      parameters: {
        copies,
        colorMode: isColor ? 'COLOR' : 'BW',
        paperSize: 'A4',
        printerId: printer?.id || 'printer-hp-1',
        printerName: printer?.name || 'HP LaserJet Pro M404n'
      },
      title: `Dispatch Print: ${copies} Copies (${isColor ? 'Color' : 'B&W'})`,
      explanation: `Prepared print command for ${copies} cop${copies > 1 ? 'ies' : 'y'} to ${printer?.name}.`,
      hindiExplanation: `${printer?.name} पर ${copies} कॉपी (${isColor ? 'कलर' : 'ब्लैक एंड व्हाइट'}) प्रिंट भेजी जा रही है।`,
      autoExecute: true,
      targetStudioTab: 'printing'
    };
  }

  // 6. Business Analytics Insights
  if (p.includes('revenue') || p.includes('kamai') || p.includes('biki') || p.includes('printer') || p.includes('stock') || p.includes('kaisa hai') || p.includes('aaj kitne')) {
    let insightType = 'GENERAL';
    let answer = '';
    let hindi = '';

    const todayRev = store.jobs.filter(j => j.paymentStatus === 'PAID').reduce((sum, j) => sum + j.totalAmount, 0);
    const todayJobs = store.jobs.length;
    const printsToday = store.printers.reduce((acc, p) => acc + p.totalPrintsToday, 0);

    if (p.includes('revenue') || p.includes('kamai')) {
      insightType = 'REVENUE';
      answer = `Today's revenue is ₹${todayRev.toLocaleString('en-IN')} across ${todayJobs} jobs. This is 14% higher than yesterday's counter pace.`;
      hindi = `आज की कुल कमाई ₹${todayRev.toLocaleString('en-IN')} रही (${todayJobs} जॉब्स)। कल के मुकाबले 14% की बढ़त है।`;
    } else if (p.includes('printer') || p.includes('use')) {
      const topPrinter = [...store.printers].sort((a, b) => b.totalPrintsToday - a.totalPrintsToday)[0];
      answer = `Most used printer is ${topPrinter.name} with ${topPrinter.totalPrintsToday} prints today (${topPrinter.tonerBlack}% toner remaining).`;
      hindi = `सबसे ज़्यादा इस्तेमाल होने वाला प्रिंटर ${topPrinter.name} है, जिससे आज ${topPrinter.totalPrintsToday} प्रिंट निकले हैं।`;
    } else if (p.includes('stock') || p.includes('paper')) {
      const lowItems = store.inventory.filter(i => i.status === 'LOW' || i.status === 'CRITICAL');
      answer = `A4 Paper is sufficient for ~3 days (14 reams). However, 4x6 Photo Paper (35 sheets) and Canon GI-790 Color Inks are running LOW!`;
      hindi = `A4 पेपर लगभग 3 दिन चलेगा (14 रीम)। लेकिन 4x6 फोटो पेपर (35 शीट) और कलर इंक खत्म होने वाली है, रीस्टॉक कर लें।`;
    } else {
      answer = `Today: ${todayJobs} jobs handled, ₹${todayRev} collected, ${printsToday} total sheets printed. HP LaserJet is running at optimal load.`;
      hindi = `आज कुल ${todayJobs} काम पूरे हुए, ₹${todayRev} का कलेक्शन हुआ और ${printsToday} प्रिंट्स निकले।`;
    }

    return {
      intent: 'BUSINESS_INSIGHT',
      parameters: { insightType, todayRev, todayJobs, printsToday },
      title: 'Counter Business Intelligence',
      explanation: answer,
      hindiExplanation: hindi,
      autoExecute: false,
      targetStudioTab: 'reports',
      dataPayload: { todayRev, todayJobs, printsToday }
    };
  }

  // Default Fallback
  return {
    intent: 'GENERAL_HELP',
    parameters: { rawQuery: prompt },
    title: 'Ready at your Counter',
    explanation: 'Tell me what the customer wants (e.g. "Aadhaar front back A4", "8 passport photo", "PDF compress 200kb", "Black & white 3 copies")',
    hindiExplanation: 'ग्राहक का काम बताइए — जैसे: "आधार आगे पीछे एक पेज पर", "8 पासपोर्ट फोटो", "20 KB साइन", "कलर प्रिंट".',
    autoExecute: false,
    targetStudioTab: 'new-job'
  };
}

// POST endpoint for Copilot command
router.post('/parse', (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, message: 'Command query string required' });
  }

  const plan = parseCyberSevaIntent(query);
  store.addAudit('CyberSeva Copilot', 'AI Action Dispatched', `Command: "${query}" -> Intent: ${plan.intent}`);

  res.json({
    success: true,
    data: plan
  });
});

export default router;
