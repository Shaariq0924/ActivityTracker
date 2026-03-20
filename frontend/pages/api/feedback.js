import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { rating, message, userName, userEmail } = req.body;

  if (!rating || !message) {
    return res.status(400).json({ error: 'Rating and message are required' });
  }

  try {
    const feedbackRef = collection(db, 'feedback');
    await addDoc(feedbackRef, {
      rating,
      message,
      userName: userName || 'Anonymous',
      userEmail: userEmail || 'N/A',
      createdAt: new Date().toISOString()
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error inserting feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
