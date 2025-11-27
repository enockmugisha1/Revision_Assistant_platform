import dotenv from 'dotenv';
dotenv.config();

console.log('Testing environment variables:');
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length || 0);
console.log('GROQ_API_KEY value:', process.env.GROQ_API_KEY);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CWD:', process.cwd());

import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log('Groq client initialized:', !!groq);
