// Import the backend URL from environment
const API_URL = import.meta.env.VITE_API_URL;

// Example: Fetch questions from backend
export async function fetchQuestions() {
  try {
    const response = await fetch(`${API_URL}/api/questions`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Example: Post an answer
export async function submitAnswer(answerData) {
  try {
    const response = await fetch(`${API_URL}/api/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answerData),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
