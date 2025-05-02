// utils/generateLifeGoals.js

async function generateLifeGoals(description, client, userLang) {
    try {
      const prompt = `Based on this description: '${description}', generate 0 to 3 personalized and realistic life goals in ${userLang}. Each goal should be helpful, motivating, and aligned with what the user said. Write each goal as a clear sentence starting with a verb (e.g., "Start", "Improve", "Practice"). Do not invent interests or facts — only use what's in the description. Keep it friendly and positive, like a supportive friend. Return a JSON object like: { "goals": [{"title":"...","description":"..."},{"title":"...","description":"..."},{"title":"...","description":"..."}] }`;
  
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that gives motivating and personalized life goals in the language specified by the user."
          },
          {
            role: "user",
            content: prompt,
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
      });
  
      console.log("Life goals generated:");
      console.log(completion.choices[0].message.content);
  
      return JSON.parse(completion.choices[0].message.content.trim());
    } catch (error) {
      console.error("Error generating life goals:", error);
      return { goals: [] };
    }
  }
  
  module.exports = generateLifeGoals;
  