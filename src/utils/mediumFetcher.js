import { blogData } from '../data/articles.js';

/**
 * Fetches published articles from a Medium profile using public RSS-to-JSON API with zero-cache timestamp.
 * @param {string} username - Medium handle (e.g. 'yusufyildirimdev' or '@yusufyildirimdev')
 * @returns {Promise<Array>} List of formatted article objects
 */
export async function fetchMediumPosts(username = 'yusufyildirimdev') {
  if (!username) {
    return blogData;
  }

  // Clean username handle
  const cleanUsername = username.replace(/^@/, '').trim();
  // Append timestamp parameter to bypass server-side RSS caching
  const rssUrl = `https://medium.com/feed/@${cleanUsername}?cacheBuster=${Date.now()}`;
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&_t=${Date.now()}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error('Medium RSS feed fetch failed');

    const data = await response.json();
    if (data.status !== 'ok' || !data.items || data.items.length === 0) {
      console.warn('Medium feed returned no items, using local articles.');
      return blogData;
    }

    return data.items.map((item, index) => {
      // Extract thumbnail image from HTML description or content
      let coverImage = item.thumbnail || '';
      if (!coverImage) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
          coverImage = imgMatch[1];
        }
      }
      if (!coverImage) {
        coverImage = 'assets/images/blog_anxiety.jpg';
      }

      // Calculate approximate reading time
      const wordCount = item.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const readMinutes = Math.max(2, Math.ceil(wordCount / 200));

      // Extract text excerpt
      const plainText = item.description.replace(/<[^>]*>/g, '').trim();
      const excerpt = plainText.length > 160 ? plainText.substring(0, 160) + '...' : plainText;

      // Format publication date
      const pubDate = new Date(item.pubDate);
      const formattedDate = pubDate.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return {
        id: `medium-${index}-${cleanUsername}-${Date.now()}`,
        title: item.title,
        category: item.categories && item.categories.length > 0 ? item.categories[0] : 'Yazılım & Teknoloji',
        date: formattedDate,
        readTime: `${readMinutes} dk okuma`,
        image: coverImage,
        excerpt: excerpt || item.title,
        content: item.content,
        link: item.link,
        isMedium: true
      };
    });
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return blogData;
  }
}
