import { afterEach, describe, expect, it, vi } from 'vitest';
import { DECK_API_CONFIG } from '../config/deckApiConfig';
import { createDeck, drawCards } from './deckApi';

function stubFetch(response: { ok: boolean; status: number; json: () => Promise<unknown> }) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('deckApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rejects HTTP non-OK responses with the status message', async () => {
    stubFetch({
      ok: false,
      status: 503,
      json: vi.fn(),
    });

    await expect(createDeck()).rejects.toThrow('Request failed with status 503');
  });

  it('propagates invalid JSON or rejected json() errors', async () => {
    const invalidJsonError = new SyntaxError('Unexpected token < in JSON');
    stubFetch({
      ok: true,
      status: 200,
      json: vi.fn().mockRejectedValue(invalidJsonError),
    });

    await expect(createDeck()).rejects.toBe(invalidJsonError);
  });

  it('passes abort signals to fetch for createDeck and drawCards', async () => {
    const fetchMock = stubFetch({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ success: true }),
    });
    const createController = new AbortController();
    const drawController = new AbortController();

    await createDeck(createController.signal);
    await drawCards('deck-123', drawController.signal);

    expect(fetchMock).toHaveBeenNthCalledWith(1, expect.any(String), {
      signal: createController.signal,
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, expect.any(String), {
      signal: drawController.signal,
    });
  });

  it('constructs the expected createDeck and drawCards URLs', async () => {
    const fetchMock = stubFetch({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ success: true }),
    });

    await createDeck();
    await drawCards('deck-abc');

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      `${DECK_API_CONFIG.baseUrl}/new/shuffle/?deck_count=${DECK_API_CONFIG.deckCount}`,
      { signal: undefined },
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${DECK_API_CONFIG.baseUrl}/deck-abc/draw/?count=${DECK_API_CONFIG.cardsPerHand}`,
      { signal: undefined },
    );
  });
});
