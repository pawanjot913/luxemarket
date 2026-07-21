const OpenAI = require("openai");
const Product = require("../../models/Product");

const getOpenAIClient = () => {
  const apiKey = (process.env.OPENROUTER_API_KEY || "").trim();
  if (!apiKey) return null;

  const refererUrl = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",")[0].trim()
    : "https://luxemarkets.netlify.app";

  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": refererUrl,
      "X-Title": "Luxe Market AI Shopping Assistant",
    },
  });
};

const extractPriceLimit = (text) => {
  if (!text) return null;
  const match = text.match(/(?:under|below|less than|<|<=|₹|\$)\s*(\d+(?:\.\d+)?)/i);
  if (match && match[1]) {
    const val = parseFloat(match[1]);
    if (!isNaN(val) && val > 0) return val;
  }
  return null;
};

const searchMatchingProducts = async (userMessage) => {
  const queryText = userMessage.trim().toLowerCase();
  const maxPrice = extractPriceLimit(queryText);

  // Extract search tokens (ignore common stop words)
  const stopWords = new Set(["i", "need", "a", "an", "the", "for", "in", "under", "below", "with", "show", "me", "want", "looking", "buy", "to", "and", "or"]);
  const tokens = queryText
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  const filter = { stock: { $gt: 0 } };

  if (maxPrice !== null) {
    filter.price = { $lte: maxPrice };
  }

  // Build text regex search for tokens
  if (tokens.length > 0) {
    const tokenRegexes = tokens.map((token) => new RegExp(token, "i"));
    filter.$or = [
      { name: { $in: tokenRegexes } },
      { category: { $in: tokenRegexes } },
      { description: { $in: tokenRegexes } },
      { gender: { $in: tokenRegexes } },
      { details: { $in: tokenRegexes } },
    ];
  }

  let products = await Product.find(filter)
    .sort({ rating: -1, createdAt: -1 })
    .limit(10)
    .lean();

  // If strict query returned no items, attempt broader query or top items under maxPrice
  if (products.length === 0) {
    const fallbackFilter = { stock: { $gt: 0 } };
    if (maxPrice !== null) fallbackFilter.price = { $lte: maxPrice };
    products = await Product.find(fallbackFilter)
      .sort({ rating: -1, isNew: -1 })
      .limit(8)
      .lean();
  }

  // Format products consistently for response & prompt context
  return products.map((p) => {
    const imageArray = Array.isArray(p.image) ? p.image : (p.image ? [p.image] : []);
    return {
      id: p._id ? p._id.toString() : p.id,
      name: p.name,
      category: p.category,
      gender: p.gender || "Unisex",
      price: p.price,
      rating: p.rating || 4.5,
      description: p.description,
      image: imageArray[0] || "",
    };
  });
};

const processShoppingAssistantQuery = async (message) => {
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new Error("Message is required.");
  }

  const matchingProducts = await searchMatchingProducts(message);

  const openai = getOpenAIClient();

  // System Prompt as mandated by architecture
  const systemPrompt = `You are Luxe Market's AI Shopping Assistant.
Recommend ONLY products provided in the context below.

CONTEXT PRODUCTS:
${JSON.stringify(matchingProducts, null, 2)}

STRICT RULES:
1. Recommend ONLY products provided in the CONTEXT PRODUCTS list above.
2. NEVER invent, hallucinate, or make up products that are not present in the context.
3. NEVER alter or make up prices. Use exact prices from the context.
4. If no relevant products match the user's request in context, politely inform the user that Luxe Market currently does not have matching items and suggest exploring our main catalog categories.
5. Explain concisely why each recommended product fits the user's prompt.
6. Use clean markdown formatting with bullet points where appropriate.
7. Keep answers concise, helpful, and luxury-toned.`;

  let answer = "";

  if (openai) {
    try {
      const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      answer = response.choices[0]?.message?.content || "";
    } catch (err) {
      console.error("OpenRouter API call failed:", err?.response?.data || err?.message || err);
    }
  }

  // Local fallback if OpenRouter key is not set or API call failed
  if (!answer) {
    if (matchingProducts.length > 0) {
      answer = `Here are top recommendations from Luxe Market matching your request:\n\n` +
        matchingProducts
          .slice(0, 5)
          .map((p) => `* **${p.name}** ($${p.price.toFixed(2)}) — ${p.category} (${p.rating}★ rating)\n  ${p.description}`)
          .join("\n\n");
    } else {
      answer = `I couldn't find any items matching your criteria in our current catalog. Please try exploring our Collections, Men, Women, or Accessories pages!`;
    }
  }

  return {
    success: true,
    answer,
    products: matchingProducts,
  };
};

module.exports = {
  processShoppingAssistantQuery,
};
