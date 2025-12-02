import { createClient } from 'npm:@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: any;

Deno.serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // 1. Initialize Clients
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const geminiKey = Deno.env.get('GEMINI_API_KEY') ?? '';

        if (!supabaseUrl || !supabaseKey || !geminiKey) {
            throw new Error('Missing environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or GEMINI_API_KEY');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

        // 2. Fetch Data from Supabase
        console.log('Fetching data from Supabase...');
        const [projects, skills, experience, traits, contact, customImages, modelContexts, certifications] = await Promise.all([
            supabase.from('projects').select('*').order('created_at', { ascending: false }),
            supabase.from('skills').select('*'),
            supabase.from('experience').select('*').order('created_at', { ascending: false }),
            supabase.from('personal_traits').select('*'),
            supabase.from('contact_info').select('*'),
            supabase.from('custom_images').select('*').order('created_at', { ascending: false }),
            supabase.from('model_contexts').select('*'),
            supabase.from('certifications').select('*').order('created_at', { ascending: false })
        ]);

        // 3. Fetch System Prompt
        const { data: promptData } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'system_prompt')
            .single();

        const systemPrompt = promptData?.value || '';

        // 4. Chunk Data
        const chunks: { id: string; text: string; metadata: any }[] = [];

        // System Prompt Chunk
        if (systemPrompt) {
            chunks.push({
                id: 'system-prompt',
                text: `System Prompt / Custom Instructions: ${systemPrompt}`,
                metadata: { type: 'system_prompt' }
            });
        }

        // Projects
        if (projects.data) {
            const projectSummary = projects.data.map(p => p.title).join(', ');
            chunks.push({
                id: 'projects-summary',
                text: `List of Projects: ${projectSummary}`,
                metadata: { type: 'summary', section: 'projects' }
            });

            projects.data.forEach(p => {
                const text = `Project: ${p.title}
Description: ${p.description}
Technologies: ${p.technologies?.join(', ') || ''}
Features: ${p.features?.join(', ') || ''}
Results: ${p.results?.map((r: any) => `${r.metric}: ${r.value}`).join(', ') || ''}
Links: GitHub (${p.github}), Live Demo (${p.link || p.demo_url})`;

                chunks.push({
                    id: `project-${p.id}`,
                    text,
                    metadata: { type: 'project', id: p.id, title: p.title }
                });
            });
        }

        // Skills
        if (skills.data) {
            const skillList = skills.data.map(s => `${s.name} (${s.category})`).join(', ');
            chunks.push({
                id: 'skills-all',
                text: `Technical Skills: ${skillList}`,
                metadata: { type: 'skills' }
            });
        }

        // Experience
        if (experience.data) {
            experience.data.forEach(exp => {
                const text = `Experience: ${exp.role} at ${exp.company}
Period: ${exp.period}
Description: ${exp.description}
Technologies: ${exp.technologies?.join(', ') || ''}`;

                chunks.push({
                    id: `experience-${exp.id}`,
                    text,
                    metadata: { type: 'experience', id: exp.id, company: exp.company }
                });
            });
        }

        // Traits
        if (traits.data) {
            const strengths = traits.data.filter(t => t.type === 'strength').map(t => t.value).join(', ');
            const weaknesses = traits.data.filter(t => t.type === 'weakness').map(t => t.value).join(', ');
            const hobbies = traits.data.filter(t => t.type === 'hobby').map(t => t.value).join(', ');

            chunks.push({ id: 'traits-strengths', text: `Strengths: ${strengths}`, metadata: { type: 'traits', subtype: 'strengths' } });
            chunks.push({ id: 'traits-weaknesses', text: `Weaknesses: ${weaknesses}`, metadata: { type: 'traits', subtype: 'weaknesses' } });
            chunks.push({ id: 'traits-hobbies', text: `Hobbies: ${hobbies}`, metadata: { type: 'traits', subtype: 'hobbies' } });
        }

        // Contact
        if (contact.data) {
            const contactText = contact.data.map(c => `${c.platform}: ${c.value}`).join('\n');
            chunks.push({
                id: 'contact-info',
                text: `Contact Information:\n${contactText}`,
                metadata: { type: 'contact' }
            });
        }

        // Custom Images
        if (customImages.data) {
            customImages.data.forEach((img: any) => {
                const text = `Image Description: ${img.description}
Tags: ${img.tags?.join(', ') || ''}
Image URL: ${img.url}`;

                chunks.push({
                    id: `image-${img.id}`,
                    text,
                    metadata: { type: 'image', id: img.id, url: img.url }
                });
            });
        }

        // Model Contexts
        if (modelContexts.data) {
            modelContexts.data.forEach((mc: any) => {
                const text = `Model Specific Context for ${mc.provider}: ${mc.content}`;
                chunks.push({
                    id: `model-context-${mc.id}`,
                    text,
                    metadata: { type: 'model_context', provider: mc.provider }
                });
            });
        }

        // Certifications
        if (certifications.data) {
            certifications.data.forEach((c: any) => {
                const text = `Certification: ${c.name}
Issuer: ${c.issuer}
Date: ${c.date}
Description: ${c.description}
Link: ${c.url}`;
                chunks.push({
                    id: `certification-${c.id}`,
                    text,
                    metadata: { type: 'certification', id: c.id, name: c.name }
                });
            });
        }

        // 5. Generate Embeddings & Store
        console.log(`Generating embeddings for ${chunks.length} chunks...`);

        // Delete existing documents
        await supabase.from('documents').delete().neq('id', 0); // Delete all

        for (const chunk of chunks) {
            const result = await model.embedContent(chunk.text);
            const embedding = result.embedding.values;

            await supabase.from('documents').insert({
                content: chunk.text,
                embedding,
                metadata: chunk.metadata
            });
        }

        return new Response(
            JSON.stringify({ success: true, message: `Successfully refreshed ${chunks.length} embeddings.` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        console.error('Error:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'An error occurred' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
