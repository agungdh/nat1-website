const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';

export interface PostDto {
  uuid: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: number;
  status: 'DRAFT' | 'PUBLISHED';
  category: CategoryDto;
  tags: TagDto[];
}

export interface CategoryDto {
  uuid: string;
  slug: string;
  name: string;
  description: string;
}

export interface TagDto {
  uuid: string;
  slug: string;
  name: string;
}

export interface ChatMessage {
  role: string;
  content: string;
}

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getPosts(): Promise<PostDto[]> {
  return (await apiFetch<PostDto[]>('/api/posts')) || [];
}

export async function getPostBySlug(slug: string): Promise<PostDto | null> {
  return apiFetch<PostDto>(`/api/posts/slug/${encodeURIComponent(slug)}`);
}

export async function getPostByUuid(uuid: string): Promise<PostDto | null> {
  return apiFetch<PostDto>(`/api/posts/${encodeURIComponent(uuid)}`);
}

export async function getCategories(): Promise<CategoryDto[]> {
  return (await apiFetch<CategoryDto[]>('/api/categories')) || [];
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDto | null> {
  return apiFetch<CategoryDto>(`/api/categories/slug/${encodeURIComponent(slug)}`);
}

export async function getTags(): Promise<TagDto[]> {
  return (await apiFetch<TagDto[]>('/api/tags')) || [];
}

export async function getTagBySlug(slug: string): Promise<TagDto | null> {
  return apiFetch<TagDto>(`/api/tags/slug/${encodeURIComponent(slug)}`);
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error(`Backend chat error: ${res.status}`);
    const data = await res.json();
    return data.reply || '';
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(msg);
  }
}
