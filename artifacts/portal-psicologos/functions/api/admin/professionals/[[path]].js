import { response } from '../../../../lib/http.js';
import { getDirectory, saveDirectory } from '../../../../lib/store.js';

// Gestão do diretório. O login é conferido antes, em ../_middleware.js.

function validateProfessional(input) {
  const fields = ['name', 'crm', 'bio', 'whatsapp', 'location', 'modality', 'initials'];
  if (!input || typeof input !== 'object') return 'Envie os dados do profissional.';
  if (fields.some((field) => typeof input[field] !== 'string' || !input[field].trim())) return 'Preencha todos os campos obrigatórios.';
  if (!Array.isArray(input.specialties) || input.specialties.length === 0 || input.specialties.some((specialty) => typeof specialty !== 'string' || !specialty.trim())) return 'Informe ao menos uma especialidade.';
  if (input.whatsapp.replace(/\D/g, '').length < 10) return 'Informe um WhatsApp válido.';
  if (input.name.trim().length > 120 || input.bio.trim().length > 500) return 'Alguns campos ultrapassaram o limite permitido.';
  return null;
}

export async function onRequest({ request, env, params }) {
  try {
    const professionals = await getDirectory(env);
    if (request.method === 'GET') return response(professionals);

    if (request.method === 'POST') {
      const input = await request.json().catch(() => null);
      const validationError = validateProfessional(input);
      if (validationError) return response({ code: 'VALIDATION_ERROR', message: validationError }, 400);
      const professional = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        crm: input.crm.trim(),
        bio: input.bio.trim(),
        specialties: [...new Set(input.specialties.map((specialty) => specialty.trim()).filter(Boolean))],
        whatsapp: input.whatsapp.trim(),
        location: input.location.trim(),
        modality: input.modality.trim(),
        initials: input.initials.trim().slice(0, 3).toUpperCase(),
      };
      await saveDirectory(env, [...professionals, professional]);
      return response(professional, 201);
    }

    
    if (request.method === 'PUT'){
      const id = [params.path ?? []].flat()[0] ?? '';
      const index = professionals.findIndex((professional) => professional.id === id);
      if (index === -1) return response({ code: 'NOT_FOUND', message: 'Profissional não encontrado.' }, 404);
      const input = await request.json().catch(() => null);
      const merged = { ...professionals[index], ...input };
      /*const merged = {...professionals[index],
        name: input?.name ?? professional[index].name, 
        crm: input?.crm ?? professional[index].crm,
        bio: input?.bio ?? bio[index].bio,
        specialities: input?.specialities ?? professional[index].specialities,
        whatsapp: input?.whatsapp ?? professional[index].whatsapp,
        location: input?.location ?? professional[index].location,
        modality: input?.modality ?? professional[index].modality,
        initials: input?.initials ?? professional[index].initials};*/
        const validationError = validateProfessional(merged);
        
        if (validationError) return response({ code: 'VALIDATION_ERROR', message: validationError }, 400);

        const professional = { 
          id, 
          name: merged.name.trim(), 
          crm: merged.crm.trim(),
          bio: merged.bio.trim(), 
          specialties: [...new Set(merged.specialties.map((specialty) => specialty.trim()).filter(Boolean))],
          whatsapp: merged.whatsapp.trim(), 
          location: merged.location.trim(),
          modality: merged.modality.trim(), 
          initials: merged.initials.trim().slice(0,3).toUpperCase()
        };
        const nextProfessionals = professionals.map((pro, proIndex) => (proIndex === index ? professional : pro));
        await saveDirectory(env, nextProfessionals);
        return response(professional);
    }

    if (request.method === 'DELETE') {
      const id = [params.path ?? []].flat()[0] ?? '';
      const nextProfessionals = professionals.filter((professional) => professional.id !== id);
      if (nextProfessionals.length === professionals.length) return response({ code: 'NOT_FOUND', message: 'Profissional não encontrado.' }, 404);
      await saveDirectory(env, nextProfessionals);
      return new Response(null, { status: 204 });
    }

    return response({ code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' }, 405);
  } catch (error) {
    console.error('Directory function error', error);
    return response({ code: 'DIRECTORY_ERROR', message: 'Não foi possível acessar o diretório agora.' }, 500);
  }
}
