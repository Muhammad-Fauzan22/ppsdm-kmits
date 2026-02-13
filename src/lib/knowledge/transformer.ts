/**
 * NLP-lite transformer: converts raw text into interactive metadata.
 * Detects engineering terms, extracts statistics, generates quiz candidates.
 */

import { GLOSSARY_MAP, type GlossaryTerm } from './glossary';

// ─── Types ──────────────────────────────────────────

export interface DetectedTerm {
    term: string;
    definition: string;
    definitionId: string;
    category: string;
    position: [number, number]; // [start, end] in text
}

export interface QuizCandidate {
    question: string;
    options: string[];
    answer: number; // index of correct option
}

export interface DetectedStatistic {
    label: string;
    value: number;
    unit: string;
}

export interface InteractiveMetadata {
    type: 'article' | 'definition' | 'news' | 'formula' | 'statistic';
    terms: DetectedTerm[];
    quiz_candidates: QuizCandidate[];
    statistics: DetectedStatistic[];
    word_count: number;
    reading_time_minutes: number;
}

// ─── Term Detection ─────────────────────────────────

function detectTerms(text: string): DetectedTerm[] {
    const detected: DetectedTerm[] = [];
    const seen = new Set<string>();
    const lowerText = text.toLowerCase();

    for (const [key, term] of GLOSSARY_MAP) {
        const idx = lowerText.indexOf(key);
        if (idx !== -1 && !seen.has(key)) {
            seen.add(key);
            detected.push({
                term: term.term,
                definition: term.definition,
                definitionId: term.definitionId,
                category: term.category,
                position: [idx, idx + key.length],
            });
        }
    }

    // Sort by position
    detected.sort((a, b) => a.position[0] - b.position[0]);
    return detected;
}

// ─── Statistics Extraction ──────────────────────────

const STAT_PATTERNS = [
    // "400 MPa", "3.14 GPa", "1200 °C"
    /(\d+(?:\.\d+)?)\s*(MPa|GPa|kPa|Pa|°C|°F|K|kg|ton|mm|cm|m|km|Hz|kHz|MHz|GHz|W|kW|MW|rpm|N|kN|J|kJ|MJ|%)/gi,
];

function extractStatistics(text: string): DetectedStatistic[] {
    const stats: DetectedStatistic[] = [];

    for (const pattern of STAT_PATTERNS) {
        let match;
        const regex = new RegExp(pattern.source, pattern.flags);
        while ((match = regex.exec(text)) !== null) {
            const value = parseFloat(match[1]);
            if (!isNaN(value)) {
                // Try to find label (preceding words before the number)
                const before = text.substring(Math.max(0, match.index - 50), match.index).trim();
                const labelMatch = before.match(/([A-Za-z\s]{3,30})$/);
                const label = labelMatch ? labelMatch[1].trim() : 'Value';

                stats.push({
                    label,
                    value,
                    unit: match[2],
                });
            }

            if (stats.length >= 10) break; // Cap at 10 statistics
        }
    }

    return stats;
}

// ─── Quiz Generation ────────────────────────────────

function generateQuizzes(terms: DetectedTerm[]): QuizCandidate[] {
    if (terms.length < 2) return [];

    const quizzes: QuizCandidate[] = [];

    for (const term of terms.slice(0, 5)) {
        // Generate "What is X?" quiz
        const wrongAnswers = terms
            .filter(t => t.term !== term.term)
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)
            .map(t => t.definitionId);

        if (wrongAnswers.length < 2) continue;

        const options = [term.definitionId, ...wrongAnswers];
        // Shuffle options
        const shuffled = options.sort(() => Math.random() - 0.5);
        const correctIndex = shuffled.indexOf(term.definitionId);

        quizzes.push({
            question: `Apa yang dimaksud dengan "${term.term}"?`,
            options: shuffled,
            answer: correctIndex,
        });
    }

    return quizzes;
}

// ─── Main Transformer ───────────────────────────────

export function transformContent(
    text: string,
    category: string = 'general'
): InteractiveMetadata {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const terms = detectTerms(text);
    const statistics = extractStatistics(text);
    const quizzes = generateQuizzes(terms);

    // Determine content type
    let type: InteractiveMetadata['type'] = 'article';
    if (category === 'definition') type = 'definition';
    else if (category === 'news') type = 'news';
    else if (category === 'formula') type = 'formula';
    else if (statistics.length > 3) type = 'statistic';

    return {
        type,
        terms,
        quiz_candidates: quizzes,
        statistics,
        word_count: wordCount,
        reading_time_minutes: readingTime,
    };
}
