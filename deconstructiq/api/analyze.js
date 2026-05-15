export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { image, mimeType, location } = req.body;
  if (!image) return res.status(400).json({ error: 'Image manquante' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Clé API non configurée' });

  const locCtx = location || 'Suisse Romande, région Genève';

  const prompt = `Tu es un expert en second œuvre du bâtiment et économie circulaire de la construction.
Analyse cette image de chantier. Localisation : ${locCtx}.

Identifie TOUS les matériaux visibles. Retourne UNIQUEMENT un JSON valide, sans texte avant/après ni markdown.

{
  "resume": {
    "nb_materiaux": <int>,
    "valeur_totale_min": <int CHF>,
    "valeur_totale_max": <int CHF>,
    "taux_recuperabilite": <int 0-100>,
    "description_chantier": "<description courte>"
  },
  "materiaux": [
    {
      "nom": "<nom précis>",
      "categorie": "<CLOISON|VITRAGE|SOL|PLAFOND|MENUISERIE|ISOLATION|STRUCTURE|TECHNIQUE|MOBILIER>",
      "emoji": "<emoji>",
      "etat": "<EXCELLENT|BON|MOYEN|MAUVAIS>",
      "recuperable": true,
      "valeur_min_chf": <int>,
      "valeur_max_chf": <int>,
      "quantite_estimee": "<ex: 12 m²>",
      "confiance": <int 0-100>,
      "description": "<conseil récupération court>"
    }
  ],
  "acheteurs_locaux": [
    {
      "nom": "<entreprise locale fictive réaliste Genève>",
      "type": "<Négoce|Artisan|Recycleur|Promoteur>",
      "emoji": "<emoji>",
      "distance_km": <int>,
      "specialite": "<matériaux achetés>"
    }
  ]
}

Matériaux à détecter : cloisons amovibles, vitrages, murs mobiles, parquet, béton, chape, carrelage, laine de roche, laine de verre, faux-plafond, plaques de plâtre, menuiseries bois/alu, portes, fenêtres, acier, câblage, mobilier de bureau, isolation, structures métalliques.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType || 'image/jpeg', data: image } },
              { text: prompt }
            ]
          }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'Erreur Gemini' });
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);
    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
