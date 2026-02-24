/**
 * Service Locator / Dependency Container
 *
 * Central registry for service bindings and dependency injection
 */

import type { ICmsProvider } from '@/lib/cms/types';
import { umbracoProvider } from '@/providers/cms/umbraco/provider';

/**
 * Service Locator Container
 */
class ServiceLocator {
    private services = new Map<string, any>();

    /**
     * Register a service implementation
     */
    register<T>(key: string, instance: T): void {
        this.services.set(key, instance);
    }

    /**
     * Resolve a service by key
     */
    resolve<T>(key: string): T {
        const service = this.services.get(key);
        if (!service) {
            throw new Error(`Service not found: ${key}`);
        }
        return service as T;
    }

    /**
     * Check if a service is registered
     */
    has(key: string): boolean {
        return this.services.has(key);
    }
}

/**
 * Global service locator instance
 */
const container = new ServiceLocator();

/**
 * Service Keys
 */
export const ServiceKeys = {
    CMS_PROVIDER: 'CmsProvider',
} as const;

/**
 * Configure service bindings
 */
function configureServices() {
    // Bind CMS provider to Umbraco implementation
    container.register<ICmsProvider>(ServiceKeys.CMS_PROVIDER, umbracoProvider);
}

// Initialize services
configureServices();

/**
 * Get the CMS provider instance
 */
export function getCmsProvider(): ICmsProvider {
    return container.resolve<ICmsProvider>(ServiceKeys.CMS_PROVIDER);
}

/**
 * Export the container for advanced use cases
 */
export { container };
