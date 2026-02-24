/**
 * Umbraco CMS Provider Implementation
 *
 * Implements ICmsProvider interface for Umbraco Content Delivery API v2
 */

import type {
    ICmsProvider,
    CmsApiOptions,
    ContentQueryParams,
    ContentCollectionParams,
    SearchParams,
} from '@/models/cms';
import {
    getContentByPath as umbracoGetContentByPath,
    getContentById as umbracoGetContentById,
    getContentByIds as umbracoGetContentByIds,
    getContent as umbracoGetContent,
    searchContent as umbracoSearchContent,
} from './client';

/**
 * Umbraco CMS Provider
 *
 * Adapts Umbraco Content Delivery API to the ICmsProvider interface
 */
export class UmbracoProvider implements ICmsProvider {
    async getContentByPath<T>(
        path: string,
        params?: ContentQueryParams,
        options?: CmsApiOptions
    ): Promise<T> {
        return umbracoGetContentByPath<T>(path, params, options);
    }

    async getContentById<T>(
        id: string,
        params?: ContentQueryParams,
        options?: CmsApiOptions
    ): Promise<T> {
        return umbracoGetContentById<T>(id, params, options);
    }

    async getContentByIds<T>(
        ids: string[],
        params?: ContentQueryParams,
        options?: CmsApiOptions
    ): Promise<T> {
        return umbracoGetContentByIds<T>(ids, params, options);
    }

    async getContent<T>(
        params?: ContentCollectionParams,
        options?: CmsApiOptions
    ): Promise<T> {
        return umbracoGetContent<T>(params, options);
    }

    async searchContent<T>(
        query: string,
        params?: SearchParams,
        options?: CmsApiOptions
    ): Promise<T> {
        return umbracoSearchContent<T>(query, params, options);
    }
}

/**
 * Singleton instance of the Umbraco provider
 */
export const umbracoProvider = new UmbracoProvider();
