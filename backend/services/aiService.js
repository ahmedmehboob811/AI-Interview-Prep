const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateInterviewQuestions = async (role, experience) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate 5 interview questions for a ${role} position with ${experience} years of experience.
    Focus on technical skills, problem-solving, and role-specific scenarios.
    Return the questions as a JSON array of strings.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let questions;
    try {
      questions = JSON.parse(text);
    } catch (parseError) {
      throw new Error('Failed to parse AI response: ' + parseError.message);
    }
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate interview questions');
  }
};

const evaluateAnswer = async (question, answer) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Evaluate the following interview answer on a scale of 1-10 for:
    1. Technical accuracy
    2. Completeness
    3. Communication clarity
    4. Problem-solving approach

    Question: ${question}
    Answer: ${answer}

    Provide a JSON response with:
    {
      "score": number (1-10),
      "feedback": "detailed feedback string",
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let evaluation;
    try {
      evaluation = JSON.parse(text);
    } catch (parseError) {
      throw new Error('Failed to parse AI response: ' + parseError.message);
    }
    return evaluation;
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw new Error('Failed to evaluate answer');
  }
};

module.exports = {
  generateInterviewQuestions,
  evaluateAnswer,
};
