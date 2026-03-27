import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, username, password, image } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists in Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in Firestore
    const docRef = await addDoc(usersRef, {
      name,
      username: username.toLowerCase(),
      password: hashedPassword,
      image: image || null,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ 
      message: 'User created successfully', 
      user: { id: docRef.id, name, username } 
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}
