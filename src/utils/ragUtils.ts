import { PortfolioData } from "../types/portfolio";
import { customContext } from "../data/customContext";
import { portfolioData } from "../data/portfolioData";

export interface Chunk {
    id: string;
    text: string;
    metadata: {
        type: 'bio' | 'skill' | 'project' | 'experience' | 'contact' | 'trait' | 'custom';
        title?: string;
    };
}

export const chunkPortfolioData = (data: PortfolioData): Chunk[] => {
    const chunks: Chunk[] = [];

    // 1. Bio Chunk
    chunks.push({
        id: 'bio',
        text: `Bio: ${data.bio} Name: ${data.name}. Title: ${data.title}.`,
        metadata: { type: 'bio', title: 'Biography' }
    });

    // 2. Skills Chunk
    const skillsText = data.skills.map(s => `${s.name} (${s.category})`).join(', ');
    chunks.push({
        id: 'skills',
        text: `Skills: ${skillsText}`,
        metadata: { type: 'skill', title: 'Skills' }
    });

    // 3. Projects Chunks
    // Add a summary chunk for "all projects" queries
    const allProjectsSummary = data.projects.map(p => `${p.title} (GitHub: ${p.github}, Live: ${p.link || p.demoUrl})`).join('; ');
    chunks.push({
        id: 'projects-summary',
        text: `All Projects List with Links: ${allProjectsSummary}. I have worked on ${data.projects.length} projects in total. Use this list to provide a summary with links when asked about "all projects".`,
        metadata: { type: 'project', title: 'All Projects Summary' }
    });

    data.projects.forEach(project => {
        const projectText = `Project: ${project.title}. Description: ${project.description}. Technologies: ${project.technologies.join(', ')}. Features: ${project.features.join(', ')}. Results: ${project.results?.map(r => r.metric + ': ' + r.value).join(', ') || 'N/A'}. Links: GitHub (${project.github}), Live Demo (${project.link || project.demoUrl}).`;
        chunks.push({
            id: `project-${project.id}`,
            text: projectText,
            metadata: { type: 'project', title: project.title }
        });
    });

    // 4. Experience Chunks
    data.experience.forEach(exp => {
        const expText = `Experience: ${exp.role} at ${exp.company}. Period: ${exp.period}. Description: ${exp.description}. Technologies: ${exp.technologies?.join(', ') || 'N/A'}.`;
        chunks.push({
            id: `exp-${exp.id}`,
            text: expText,
            metadata: { type: 'experience', title: exp.role }
        });
    });

    // 5. Personal Traits Chunk
    if (data.personalTraits) {
        const traitsText = `Strengths: ${data.personalTraits.strengths.join(', ')}. Weaknesses: ${data.personalTraits.weaknesses.join(', ')}. Hobbies: ${data.personalTraits.hobbies.join(', ')}.`;
        chunks.push({
            id: 'traits',
            text: `Personal Traits: ${traitsText}`,
            metadata: { type: 'trait', title: 'Personal Traits' }
        });
    }

    // 6. Contact Chunk
    const contactText = `Email: ${data.contact.email}. GitHub: ${data.contact.github}. LinkedIn: ${data.contact.linkedin}. Twitter: ${data.contact.twitter}. Resume: ${data.contact.resume}.`;
    chunks.push({
        id: 'contact',
        text: `Contact Info: ${contactText}`,
        metadata: { type: 'contact', title: 'Contact Information' }
    });

    // 7. Custom Context Chunks (from customContext.ts)
    // Split by major section headers (lines starting with uppercase words and colon, or ###)
    const customSections = customContext.split(/\n(?=[A-Z\s&]+:)/g).filter(s => s.trim().length > 0);

    customSections.forEach((section, index) => {
        const titleMatch = section.match(/^([A-Z\s&]+):/);
        const title = titleMatch ? titleMatch[1].trim() : 'Additional Info';

        chunks.push({
            id: `custom-${index}`,
            text: section.trim(),
            metadata: { type: 'custom', title: title }
        });
    });

    return chunks;
};

// Simple RAG implementation: Returns all chunks for now (Small context fits in Gemini 1.5 Flash)
// In a larger app, we would use embeddings and cosine similarity here.
import { createClient } from '@supabase/supabase-js';
import { google } from '@ai-sdk/google';
import { embed } from 'ai';

export const findRelevantChunks = async (query: string): Promise<Chunk[]> => {
    try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase keys missing in ragUtils, falling back to local.');
            return chunkPortfolioData(portfolioData);
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Generate embedding for the query
        const { embedding } = await embed({
            model: google.textEmbeddingModel('text-embedding-004'),
            value: query,
        });

        // 2. Search Supabase for matching documents
        const { data: documents, error } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.5, // Adjust threshold as needed
            match_count: 10       // Adjust count as needed
        });

        if (error) {
            console.error('Error searching documents:', error);
            // Fallback to local chunks if DB fails
            return chunkPortfolioData(portfolioData);
        }

        // 3. Map back to Chunk format
        return documents.map((doc: any) => ({
            id: doc.id.toString(),
            text: doc.content,
            metadata: doc.metadata
        }));

    } catch (error) {
        console.error('Error in RAG search:', error);
        // Fallback
        return chunkPortfolioData(portfolioData);
    }
};

