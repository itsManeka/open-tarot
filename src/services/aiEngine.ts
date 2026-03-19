import { auth } from './firebase';

export async function sendMessageToAI(prompt: string): Promise<string> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Usuario nao autenticado');

  const res = await fetch(`${import.meta.env.VITE_ASTRO_API}/ai/interpret`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message: prompt })
  });

  if (!res.ok) throw new Error('Erro na interpretacao');
  const data = await res.json();
  return data.text;
}
