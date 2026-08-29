export type YouTubeShort = {
  id: string;
  title: string;
  url: string;
  embedUrl: string;
};

type YouTubeChannelListResponse = {
  items?: {
    id?: string;
  }[];
};

type YouTubeSearchListResponse = {
  items?: {
    id?: {
      videoId?: string;
    };
    snippet?: {
      title?: string;
    };
  }[];
};

const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";
const DEFAULT_CHANNEL_HANDLE = "@chadorak";
const MAX_SHORTS_COUNT = 5;
const DEFAULT_CACHE_SECONDS = 60 * 60 * 24;

const fallbackShorts: YouTubeShort[] = [
  {
    id: "DmyvFPBZv04",
    title: "이 차, 30대부터는 현실적인 드림카라고 할 수 있겠네요",
  },
  {
    id: "xHIz_wdka2M",
    title: "BMW X5가 부담스럽다면 이 차를 보세요",
  },
  {
    id: "PUeKnslRXtI",
    title: "30년동안 200만KM 타도 안 고장나는 차",
  },
  {
    id: "iPh6ZdBTZkc",
    title: "118d vs 골프 vs 미니쿠퍼 당신의 선택은?",
  },
  {
    id: "zFWgw_lf3Vo",
    title: "외제차 중 가성비 최고의 차",
  },
].map(({ id, title }) => ({
  id,
  title,
  url: `https://www.youtube.com/shorts/${id}`,
  embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
}));

const getCacheSeconds = () => {
  const cacheSeconds = Number(process.env.YOUTUBE_SHORTS_CACHE_SECONDS);

  return Number.isFinite(cacheSeconds) && cacheSeconds > 0
    ? cacheSeconds
    : DEFAULT_CACHE_SECONDS;
};

const getRequiredApiKey = () => {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  return apiKey;
};

const getChannelHandle = () =>
  process.env.YOUTUBE_CHANNEL_HANDLE?.trim() || DEFAULT_CHANNEL_HANDLE;

const requestYouTubeApi = async <T>(
  path: string,
  params: Record<string, string>,
) => {
  const apiKey = getRequiredApiKey();

  if (!apiKey) {
    return null;
  }

  const searchParams = new URLSearchParams({
    ...params,
    key: apiKey,
  });

  const response = await fetch(`${YOUTUBE_API_BASE_URL}${path}?${searchParams}`, {
    next: { revalidate: getCacheSeconds() },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
};

const findChannelIdByHandle = async () => {
  const channel = await requestYouTubeApi<YouTubeChannelListResponse>(
    "/channels",
    {
      part: "id",
      forHandle: getChannelHandle(),
    },
  );

  return channel?.items?.[0]?.id ?? null;
};

const toShort = (videoId: string, title?: string): YouTubeShort => ({
  id: videoId,
  title: title?.trim() || "차도락 쇼츠",
  url: `https://www.youtube.com/shorts/${videoId}`,
  embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
});

const findShortsByChannelId = async (channelId: string) => {
  const result = await requestYouTubeApi<YouTubeSearchListResponse>("/search", {
    part: "snippet",
    channelId,
    maxResults: String(MAX_SHORTS_COUNT),
    order: "date",
    type: "video",
    videoDuration: "short",
  });

  return (
    result?.items
      ?.map((item) => {
        const videoId = item.id?.videoId;

        return videoId ? toShort(videoId, item.snippet?.title) : null;
      })
      .filter((short): short is YouTubeShort => short !== null) ?? []
  );
};

export const youtubeShortsApi = {
  findChannelShorts: async () => {
    try {
      const channelId = process.env.YOUTUBE_CHANNEL_ID?.trim()
        || (await findChannelIdByHandle());

      if (!channelId) {
        return fallbackShorts;
      }

      const shorts = await findShortsByChannelId(channelId);

      return shorts.length > 0 ? shorts : fallbackShorts;
    } catch {
      return fallbackShorts;
    }
  },
};
