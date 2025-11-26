import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { portfolioData } from '../data/portfolioData';
import { chunkPortfolioData } from '../utils/ragUtils';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY is not set in .env file');
    process.exit(1);
}

const OUTPUT_FILE = path.resolve(process.cwd(), 'src/data/embeddings.json');

async function generateEmbeddings() {
    console.log('Starting embedding generation...');

    const chunks = chunkPortfolioData(portfolioData);
    console.log(`Generated ${chunks.length} chunks from portfolio data.`);

    const embeddedChunks = [];

    for (const chunk of chunks) {
        console.log(`Generating embedding for chunk: ${chunk.id}`);

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'models/text-embedding-004',
                        content: {
                            parts: [{ text: chunk.text }]
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const embedding = data.embedding.values;

            embeddedChunks.push({
                ...chunk,
                embedding
            });

        } catch (error) {
            console.error(`Failed to generate embedding for chunk ${chunk.id}:`, error);
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(embeddedChunks, null, 2));
    console.log(`Successfully saved ${embeddedChunks.length} embeddings to ${OUTPUT_FILE}`);
}

generateEmbeddings();
