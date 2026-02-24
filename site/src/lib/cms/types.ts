/**
 * CMS Provider Interface
 *
 * Abstraction layer for content management system operations.
 * Implementations: Umbraco, Contentful, Strapi, etc.
 */

/**
 * Options for CMS API requests
 */
export interface CmsApiOptions {
    /**
     * Cache strategy for the request
     */
    cache?: RequestCache;
    /**
     * Revalidation period in seconds (ISR)
     */
    revalidate?: number;
    /**
     * Additional headers
     */
    headers?: HeadersInit;
    /**
     * Culture/language for localized content (e.g., 'en-US', 'da-DK')
     */
    culture?: string;
    /**
     * Start item to scope content underneath it (GUID)
     */
    startItem?: string;
    /**
     * Enable preview/draft mode
     */
    preview?: boolean;
}

/**
 * Query parameters for content retrieval
 */
export interface ContentQueryParams {
    /**
     * Property expansion (e.g., 'properties[$all]', 'properties[alias1,alias2]')
     */
    expand?: string;
    /**
     * Limit fields returned (e.g., 'properties[alias1,alias2]')
     */
    fields?: string;
}

/**
 * Parameters for content collection queries
 */
export interface ContentCollectionParams extends ContentQueryParams {
    /**
     * Fetch specific content by selector (e.g., 'ancestors:currentItemGuid')
     */
    fetch?: string;
    /**
     * Filter content (e.g., 'contentType:blogPost')
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
}

/**
 * Parameters for search operations
 */
export interface SearchParams {
    skip?: number;
    take?: number;
    sort?: string;
}

/**
 * Generic content item structure
 */
export interface ContentItem<TProperties = Record<string, any>> {
    id: string;
    name: string;
    contentType: string;
    createDate: string;
    updateDate: string;
    route: {
        path: string;
        startItem: {
            id: string;
            path: string;
        };
    };
    properties: TProperties;
    cultures?: Record<string, any>;
}

/**
 * Response for content collections
 */
export interface ContentCollection<T = ContentItem> {
    items: T[];
    total: number;
}

/**
 * CMS Provider Interface
 *
 * All CMS implementations must conform to this interface
 */
export interface ICmsProvider {
    /**
     * Get content by path/route
     */
    getContentByPath<T>(
        path: string,
        params?: ContentQueryParams,
        options?: CmsApiOptions
    ): Promise<T>;

    /**
     * Get content by ID (GUID)
     */
    getContentById<T>(
        id: string,
        params?: ContentQueryParams,
        options?: CmsApiOptions
    ): Promise<T>;

    /**
     * Get multiple content items by IDs
     */
    getContentByIds<T>(
        ids: string[],
        params?: ContentQueryParams,
        options?: CmsApiOptions
    ): Promise<T>;

    /**
     * Query content items with filtering and pagination
     */
    getContent<T>(
        params?: ContentCollectionParams,
        options?: CmsApiOptions
    ): Promise<T>;

    /**
     * Search content by name
     */
    searchContent<T>(
        query: string,
        params?: SearchParams,
        options?: CmsApiOptions
    ): Promise<T>;
}
