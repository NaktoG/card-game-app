import type { ApiDeck, DrawCardsResponse } from '../domain/types';
import { DECK_API_CONFIG } from '../config/deckApiConfig';

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function createDeck(signal?: AbortSignal): Promise<ApiDeck> {
  return requestJson<ApiDeck>(
    `${DECK_API_CONFIG.baseUrl}/new/shuffle/?deck_count=${DECK_API_CONFIG.deckCount}`,
    signal,
  );
}

export function drawCards(deckId: string, signal?: AbortSignal): Promise<DrawCardsResponse> {
  return requestJson<DrawCardsResponse>(
    `${DECK_API_CONFIG.baseUrl}/${deckId}/draw/?count=${DECK_API_CONFIG.cardsPerHand}`,
    signal,
  );
}
