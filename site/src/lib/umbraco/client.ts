/**
 * Umbraco Content Delivery API Client
 *
 * Provides methods to fetch content from Umbraco headless CMS.
 * Uses the Content Delivery API v2.
 *
 * @see https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api
 */

const UMBRACO_API_URL = process.env.UMBRACO_API_URL || 'https://localhost:5001';
const UMBRACO_API_KEY = process.env.UMBRACO_API_KEY;

interface UmbracoApiOptions {
  cache?: RequestCache;
  revalidate?: number;
  headers?: HeadersInit;
}

/**
 * Base fetch function for Umbraco API requests
 */
async function fetchUmbraco<T>(
  endpoint: string,
  options: UmbracoApiOptions = {}
): Promise<T> {
  const url = `${UMBRACO_API_URL}/umbraco/delivery/api/v2${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add API key if configured
  if (UMBRACO_API_KEY) {
    headers['Api-Key'] = UMBRACO_API_KEY;
  }

  const response = await fetch(url, {
    headers,
    cache: options.cache,
    next: options.revalidate ? { revalidate: options.revalidate } : undefined,
  });

  if (!response.ok) {
    throw new Error(
      `Umbraco API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Get content by path
 *
 * @example
 * ```ts
 * const page = await getContentByPath('/marketing/about');
 * ```
 */
export async function getContentByPath(
  path: string,
  options: UmbracoApiOptions = {}
) {
  return fetchUmbraco(`/content/item${path}`, options);
}

/**
 * Get content by ID
 *
 * @example
 * ```ts
 * const page = await getContentById('abc123');
 * ```
 */
export async function getContentById(
  id: string,
  options: UmbracoApiOptions = {}
) {
  return fetchUmbraco(`/content/item/${id}`, options);
}

/**
 * Get all content items (paginated)
 *
 * @example
 * ```ts
 * const { items, total } = await getContent({ skip: 0, take: 10 });
 * ```
 */
export async function getContent(
  params?: {
    skip?: number;
    take?: number;
    filter?: string;
    sort?: string;
  },
  options: UmbracoApiOptions = {}
) {
  const searchParams = new URLSearchParams();

  if (params?.skip) searchParams.set('skip', params.skip.toString());
  if (params?.take) searchParams.set('take', params.take.toString());
  if (params?.filter) searchParams.set('filter', params.filter);
  if (params?.sort) searchParams.set('sort', params.sort);

  const query = searchParams.toString();
  const endpoint = `/content${query ? `?${query}` : ''}`;

  return fetchUmbraco(endpoint, options);
}

/**
 * Search content
 *
 * @example
 * ```ts
 * const results = await searchContent('wellness');
 * ```
 */
export async function searchContent(
  query: string,
  options: UmbracoApiOptions = {}
) {
  return getContent({ filter: `name:${query}` }, options);
}
