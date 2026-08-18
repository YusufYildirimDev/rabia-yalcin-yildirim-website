import { videoData } from '../data/videos.js';

/**
 * Robust YouTube Video Fetcher for Channel UCH3RVGGXxGMBlH_BKCPT1bA
 */
export async function fetchYouTubeVideos(channelTarget = 'UCH3RVGGXxGMBlH_BKCPT1bA') {
  const channelId = 'UCH3RVGGXxGMBlH_BKCPT1bA';
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  
  // Primary Strategy: RSS-to-JSON
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&_t=${Date.now()}`;

  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        return data.items.map((item, index) => {
          let videoId = '';
          if (item.guid && item.guid.includes('yt:video:')) {
            videoId = item.guid.split('yt:video:')[1];
          } else if (item.link) {
            const match = item.link.match(/(?:v=|\/shorts\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
            if (match) videoId = match[1];
          }
          if (!videoId) videoId = 'FV1bWeZStzk';

          return {
            id: videoId,
            videoId: videoId,
            title: item.title || 'Araştırma Yöntemleri Ve Bilimsel Etik Video',
            desc: item.description || 'Yusuf Muhammet YILDIRIM YouTube Kanalı İçeriği',
            image: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            duration: 'YouTube Video',
            embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`,
            link: item.link || `https://www.youtube.com/watch?v=${videoId}`,
            isYouTube: true
          };
        });
      }
    }
  } catch (err) {
    console.warn('RSS API fetch failed, trying secondary fallback strategy', err);
  }

  // Secondary Strategy: Verified Active YouTube Channel Items
  return [
    {
      id: 'FV1bWeZStzk',
      videoId: 'FV1bWeZStzk',
      title: 'Araştırma Yöntemleri Ve Bilimsel Etik Video',
      desc: 'Yusuf Muhammet YILDIRIM YouTube Kanalı Resmi Video İçeriği',
      image: 'https://img.youtube.com/vi/FV1bWeZStzk/hqdefault.jpg',
      duration: 'YouTube Video',
      embedUrl: 'https://www.youtube-nocookie.com/embed/FV1bWeZStzk?autoplay=1',
      link: 'https://www.youtube.com/watch?v=FV1bWeZStzk',
      isYouTube: true
    },
    ...videoData
  ];
}
