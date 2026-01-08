
import { GoogleGenAI } from "@google/genai";
import { Transaction, Lending, Debt, Goal, Budget } from '../types';

export const getFinancialAdvice = async (data: {
  transactions: Transaction[];
  lendings: Lending[];
  debts: Debt[];
  goals: Goal[];
  budgets: Budget[];
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    As a professional senior financial advisor, analyze the following user data and provide 3-5 high-impact, actionable, and encouraging pieces of advice in Indian Rupees (₹).
    Focus on areas like: overspending in specific categories, money lending risks (recovering money from others), optimizing debt payments, or reaching savings goals faster.
    
    User Data:
    - Recent Transactions: ${JSON.stringify(data.transactions.slice(0, 10))}
    - Budgets vs Spent: ${JSON.stringify(data.budgets)}
    - Active Debts (Loans/EMIs): ${JSON.stringify(data.debts)}
    - Money Lent to Others: ${JSON.stringify(data.lendings)}
    - Financial Goals: ${JSON.stringify(data.goals)}
    
    Special Focus: Evaluate if the user is lending too much money relative to their debts and goals.
    
    Return your response as a JSON object with the following structure:
    {
      "suggestions": [
        { "title": "...", "advice": "...", "impact": "High/Medium/Low", "category": "Debt/Lending/Saving" }
      ],
      "overallHealthScore": number (0-100)
    }
    Respond ONLY with the JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{"suggestions": [], "overallHealthScore": 0}');
    return result;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      suggestions: [
        {
          title: "System Busy",
          advice: "We couldn't generate custom AI tips right now. Focus on tracking your money lent to others!",
          impact: "Low",
          category: "Support"
        }
      ],
      overallHealthScore: 50
    };
  }
};
