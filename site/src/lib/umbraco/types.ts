/**
 * Umbraco Content Delivery API Types
 *
 * Common types for Umbraco content items.
 * Extend these based on your content types.
 */

export interface UmbracoContent<TProperties = Record<string, any>> {
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
  cultures?: Record<string, UmbracoCulture>;
}

export interface UmbracoCulture {
  name: string;
  createDate: string;
  updateDate: string;
  properties: Record<string, any>;
}

export interface UmbracoContentResponse<T = UmbracoContent> {
  items: T[];
  total: number;
}

export interface UmbracoMedia {
  id: string;
  name: string;
  mediaType: string;
  url: string;
  extension: string;
  width?: number;
  height?: number;
  bytes?: number;
  properties: Record<string, any>;
}
