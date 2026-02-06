import { getContentByPath } from '@/lib/umbraco';
import type { UmbracoContent } from '@/lib/umbraco';

// Example properties for an "About" page content type
interface AboutPageProperties {
  title: string;
  description: string;
  bodyText: string;
}

export default async function AboutPage() {
  try {
    // Fetch content from Umbraco Content Delivery API
    const content = await getContentByPath<
      UmbracoContent<AboutPageProperties>
    >('/marketing/about', {
      // Revalidate every 60 seconds (ISR)
      revalidate: 60,
    });

    return (
      <main className="container">
        <h1>{content.properties.title}</h1>
        <p className="lead">{content.properties.description}</p>
        <div
          dangerouslySetInnerHTML={{ __html: content.properties.bodyText }}
        />
        <footer>
          <small>
            Last updated: {new Date(content.updateDate).toLocaleDateString()}
          </small>
        </footer>
      </main>
    );
  } catch (error) {
    console.error('Failed to fetch content:', error);

    return (
      <main className="container">
        <h1>About</h1>
        <p>Content not available. Make sure Umbraco CMS is running.</p>
      </main>
    );
  }
}
