import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function testGroqChat() {
  console.log('Testing Groq AI Integration...\n');
  
  try {
    // Test 1: Simple chat
    console.log('Test 1: Simple Chat');
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Explain photosynthesis in 2 sentences"
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });
    
    console.log('Response:', chatCompletion.choices[0]?.message?.content);
    console.log('\n✅ Simple chat test passed!\n');

    // Test 2: Streaming chat
    console.log('Test 2: Streaming Chat');
    const streamCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "List 3 benefits of studying regularly"
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_tokens: 8192,
      top_p: 1,
      stream: true,
    });

    process.stdout.write('Streaming response: ');
    for await (const chunk of streamCompletion) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
    console.log('\n\n✅ Streaming chat test passed!\n');

    // Test 3: Multi-turn conversation
    console.log('Test 3: Multi-turn Conversation');
    const conversationCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "What is algebra?"
        },
        {
          role: "assistant",
          content: "Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols."
        },
        {
          role: "user",
          content: "Give me one simple example"
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });
    
    console.log('Response:', conversationCompletion.choices[0]?.message?.content);
    console.log('\n✅ Multi-turn conversation test passed!\n');

    console.log('🎉 All Groq integration tests passed successfully!');

  } catch (error) {
    console.error('❌ Error testing Groq:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testGroqChat();
