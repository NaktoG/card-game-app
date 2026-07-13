import type { ApiDeck, DrawCardsResponse } from '../domain/types';

const API_BASE_URL = 'https://www.deckofcardsapi.com/api/deck';

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function createDeck(signal?: AbortSignal): Promise<ApiDeck> {
  return requestJson<ApiDeck>(`${API_BASE_URL}/new/shuffle/?deck_count=1`, signal);
}

export function drawCards(deckId: string, signal?: AbortSignal): Promise<DrawCardsResponse> {
  return requestJson<DrawCardsResponse>(`${API_BASE_URL}/${deckId}/draw/?count=2`, signal);
}
