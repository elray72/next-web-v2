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
  /**
   * Specify culture for localized content (e.g., 'en-US', 'da-DK')
   */
  culture?: string;
  /**
   * Set a start item to scope content underneath it (GUID)
   */
  startItem?: string;
  /**
   * Enable preview mode to fetch draft content
   */
  preview?: boolean;
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

  // Build custom headers object
  const customHeaders: Record<string, string> = {};

  // Add API key if configured
  if (UMBRACO_API_KEY) {
    customHeaders['Api-Key'] = UMBRACO_API_KEY;
  }

  // Add culture/language header
  if (options.culture) {
    customHeaders['Accept-Language'] = options.culture;
  }

  // Add start item header to scope content
  if (options.startItem) {
    customHeaders['Start-Item'] = options.startItem;
  }

  // Add preview header for draft content
  if (options.preview) {
    customHeaders['Preview'] = 'true';
  }

  const fetchOptions: RequestInit & {
    next?: { revalidate?: number | false };
  } = {
    headers: { ...headers, ...customHeaders },
    cache: options.cache,
  };

  if (options.revalidate) {
    fetchOptions.next = { revalidate: options.revalidate };
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(
      `Umbraco API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Get content by path/route
 *
 * @example
 * ```ts
 * const page = await getContentByPath<UmbracoContent<MyProps>>('/marketing/about');
 * const expandedPage = await getContentByPath('/marketing/about', {
 *   expand: 'properties[$all]'
 * });
 * ```
 */
export async function getContentByPath<T>(
  path: string,
  params?: {
    /**
     * Property expansion (e.g., 'properties[$all]', 'properties[alias1,alias2]')
     */
    expand?: string;
    /**
     * Limit fields returned (e.g., 'properties[alias1,alias2]')
     */
    fields?: string;
  },
  options: UmbracoApiOptions = {}
): Promise<T> {
  const searchParams = new URLSearchParams();
  if (params?.expand) searchParams.set('expand', params.expand);
  if (params?.fields) searchParams.set('fields', params.fields);

  const query = searchParams.toString();
  const endpoint = `/content/item${path}${query ? `?${query}` : ''}`;

  return fetchUmbraco<T>(endpoint, options);
}

/**
 * Get content by ID (GUID)
 *
 * @param id - The content item's GUID
 * @example
 * ```ts
 * const page = await getContentById<UmbracoContent<MyProps>>('abc123-def456-...');
 * ```
 */
export async function getContentById<T>(
  id: string,
  params?: {
    /**
     * Property expansion (e.g., 'properties[$all]', 'properties[alias1,alias2]')
     */
    expand?: string;
    /**
     * Limit fields returned (e.g., 'properties[alias1,alias2]')
     */
    fields?: string;
  },
  options: UmbracoApiOptions = {}
): Promise<T> {
  const searchParams = new URLSearchParams();
  if (params?.expand) searchParams.set('expand', params.expand);
  if (params?.fields) searchParams.set('fields', params.fields);

  const query = searchParams.toString();
  const endpoint = `/content/item/${id}${query ? `?${query}` : ''}`;

  return fetchUmbraco<T>(endpoint, options);
}

/**
 * Get multiple content items by IDs
 *
 * @param ids - Array of content item GUIDs
 * @example
 * ```ts
 * const items = await getContentByIds<UmbracoContent>(['id1', 'id2', 'id3']);
 * ```
 */
export async function getContentByIds<T>(
  ids: string[],
  params?: {
    /**
     * Property expansion (e.g., 'properties[$all]', 'properties[alias1,alias2]')
     */
    expand?: string;
    /**
     * Limit fields returned (e.g., 'properties[alias1,alias2]')
     */
    fields?: string;
  },
  options: UmbracoApiOptions = {}
): Promise<T> {
  const searchParams = new URLSearchParams();
  ids.forEach((id) => searchParams.append('id', id));
  if (params?.expand) searchParams.set('expand', params.expand);
  if (params?.fields) searchParams.set('fields', params.fields);

  const query = searchParams.toString();
  const endpoint = `/content/items?${query}`;

  return fetchUmbraco<T>(endpoint, options);
}

/**
 * Query content items with filtering and pagination
 *
 * @example
 * ```ts
 * // Get paginated content
 * const { items, total } = await getContent<UmbracoContentResponse>({ skip: 0, take: 10 });
 *
 * // With filtering
 * const filtered = await getContent({
 *   filter: 'contentType:blogPost',
 *   sort: 'createDate:desc'
 * });
 *
 * // With expansion
 * const expanded = await getContent({
 *   expand: 'properties[$all]',
 *   take: 5
 * });
 * ```
 */
export async function getContent<T>(
  params?: {
    /**
     * Fetch specific content by selector (e.g., 'ancestors:currentItemGuid', 'children:parentGuid')
     */
    fetch?: string;
    /**
     * Filter content (e.g., 'contentType:blogPost', 'name:wellness')
     */
    filter?: string;
    /**
     * Sort results (e.g., 'createDate:asc', 'name:desc')
     */
    sort?: string;
    /**
     * Number of items to skip (pagination)
     */
    skip?: number;
    /**
     * Number of items to take (pagination)
     */
    take?: number;
    /**
     * Property expansion (e.g., 'properties[$all]', 'properties[alias1,alias2]')
     */
    expand?: string;
    /**
     * Limit fields returned (e.g., 'properties[alias1,alias2]')
     */
    fields?: string;
  },
  options: UmbracoApiOptions = {}
): Promise<T> {
  const searchParams = new URLSearchParams();

  if (params?.fetch) searchParams.set('fetch', params.fetch);
  if (params?.filter) searchParams.set('filter', params.filter);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.skip) searchParams.set('skip', params.skip.toString());
  if (params?.take) searchParams.set('take', params.take.toString());
  if (params?.expand) searchParams.set('expand', params.expand);
  if (params?.fields) searchParams.set('fields', params.fields);

  const query = searchParams.toString();
  const endpoint = `/content${query ? `?${query}` : ''}`;

  return fetchUmbraco<T>(endpoint, options);
}

/**
 * Search content by name
 *
 * @example
 * ```ts
 * const results = await searchContent<UmbracoContentResponse>('wellness');
 * ```
 */
export async function searchContent<T>(
  query: string,
  params?: {
    skip?: number;
    take?: number;
    sort?: string;
  },
  options: UmbracoApiOptions = {}
): Promise<T> {
  return getContent<T>(
    {
      filter: `name:${query}`,
      ...params,
    },
    options
  );
}
