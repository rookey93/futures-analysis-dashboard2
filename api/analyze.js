export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, type } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    let prompt = '';
    
    if (type === 'cyber') {
      // Cyber Business Risk Analysis
      prompt = `You are a cyber security and business risk analyst. Analyze the following cyber scenario and its business impact.

Scenario: "${question}"

Provide your analysis in the following JSON format only (no other text):

{
  "business_risks": {
    "legal_compliance": "2-3 sentence analysis of legal or compliance failure risks - breach of laws, regulations, or industry standards resulting in liability or sanctions",
    "operational_disruption": "2-3 sentence analysis of operational disruption - interruption to normal business processes affecting productivity or service delivery",
    "brand_impairment": "2-3 sentence analysis of brand impairment - damage to reputation that reduces customer trust and market value",
    "financial_fraud": "2-3 sentence analysis of financial fraud risks - unauthorized manipulation or theft of financial assets",
    "competitive_disadvantage": "2-3 sentence analysis of competitive disadvantage - loss of market position due to inferior capabilities or intelligence"
  },
  "overall_impact": "3-4 sentence summary of the overall business impact this scenario would have",
  "average_cost": "Estimated average cost in USD that incidents like this have cost organizations (provide a realistic range, e.g., '$2-5 million' or '$50,000-200,000')",
  "executive_questions": [
    "Strategic question 1 that executives should ask their security and risk teams",
    "Strategic question 2 that executives should ask their security and risk teams",
    "Strategic question 3 that executives should ask their security and risk teams",
    "Strategic question 4 that executives should ask their security and risk teams",
    "Strategic question 5 that executives should ask their security and risk teams"
  ],
  "data_sources": [
    "Industry report, research, or factor 1 that informed this analysis",
    "Industry report, research, or factor 2 that informed this analysis",
    "Industry report, research, or factor 3 that informed this analysis",
    "Industry report, research, or factor 4 that informed this analysis",
    "Industry report, research, or factor 5 that informed this analysis"
  ]
}`;
    } else {
      // Geopolitical Analysis (original)
      prompt = `You are a strategic foresight analyst. Analyze the following question using the PESTLE-M framework (Political, Economic, Social, Technological, Legal, Environmental, Military).

Question: "${question}"

Provide your analysis in the following JSON format only (no other text):

{
  "pestle_analysis": {
    "political": "2-3 sentence analysis",
    "economic": "2-3 sentence analysis",
    "social": "2-3 sentence analysis",
    "technological": "2-3 sentence analysis",
    "legal": "2-3 sentence analysis",
    "environmental": "2-3 sentence analysis",
    "military": "2-3 sentence analysis"
  },
  "scenarios": [
    {
      "type": "Baseline",
      "description": "Most realistic scenario based on current trends (3-4 sentences)",
      "probability": 60,
      "timeframe": "timeframe estimate",
      "key_indicators": ["indicator 1", "indicator 2", "indicator 3"]
    },
    {
      "type": "Plausible",
      "description": "Alternative possible scenario (3-4 sentences)",
      "probability": 30,
      "timeframe": "timeframe estimate",
      "key_indicators": ["indicator 1", "indicator 2", "indicator 3"]
    },
    {
      "type": "Wildcard",
      "description": "Low probability, high impact scenario (3-4 sentences)",
      "probability": 10,
      "timeframe": "timeframe estimate",
      "key_indicators": ["indicator 1", "indicator 2", "indicator 3"]
    }
  ],
  "overall_assessment": "2-3 sentence summary of the analysis",
  "strategic_questions": [
    "Strategic question 1 that executives should ask their organization",
    "Strategic question 2 that executives should ask their organization",
    "Strategic question 3 that executives should ask their organization",
    "Strategic question 4 that executives should ask their organization",
    "Strategic question 5 that executives should ask their organization"
  ],
  "data_sources": [
    "Data source or factor 1 that informed this analysis",
    "Data source or factor 2 that informed this analysis",
    "Data source or factor 3 that informed this analysis",
    "Data source or factor 4 that informed this analysis",
    "Data source or factor 5 that informed this analysis"
  ]
}`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'API request failed' });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
