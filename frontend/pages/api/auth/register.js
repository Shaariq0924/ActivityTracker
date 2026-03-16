import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully', user: { id: user._id, name: user.name, username: user.username } });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}
