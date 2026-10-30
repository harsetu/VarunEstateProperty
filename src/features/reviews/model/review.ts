export type ReviewType = 'TEXT' | 'VIDEO';

export interface Review {
  id: number;
  type: ReviewType;
  text: string | null;
  videoUrl: string | null;
  createdAt: string;
}

/** Body of POST /reviews and PUT /reviews/:id. A TEXT review carries `text`, a VIDEO review `videoUrl`. */
export interface ReviewInput {
  type: ReviewType;
  text?: string;
  videoUrl?: string;
}

export const REVIEW_TEXT_MAX = 5000;
export const REVIEW_URL_MAX = 1000;

/** A video link we know how to play. 'link' is anything else (shown as a plain link). */
export type VideoSource =
  | { kind: 'youtube'; id: string }
  | { kind: 'vimeo'; id: string }
  | { kind: 'instagram'; path: 'p' | 'reel' | 'tv'; id: string }
  | { kind: 'file'; url: string }
  | { kind: 'link'; url: string };

const FILE_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v)$/i;

export const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value.trim());
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

export const parseVideoUrl = (raw: string): VideoSource => {
  const url = raw.trim();
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '');
    if (host === 'youtu.be') return { kind: 'youtube', id: u.pathname.slice(1).split('/')[0] };
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const id = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/)?.[1];
      if (id) return { kind: 'youtube', id };
    }
    if (host === 'instagram.com' || host === 'instagr.am') {
      const m = u.pathname.match(/\/(p|reel|reels|tv)\/([\w-]+)/);
      if (m) return { kind: 'instagram', path: m[1] === 'reels' ? 'reel' : (m[1] as 'p' | 'reel' | 'tv'), id: m[2] };
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = u.pathname.match(/(\d{5,})/)?.[1];
      if (id) return { kind: 'vimeo', id };
    }
    if (FILE_EXT.test(u.pathname)) return { kind: 'file', url };
  } catch {
    /* fall through to a plain link */
  }
  return { kind: 'link', url };
};

export const embedUrl = (src: Extract<VideoSource, { kind: 'youtube' | 'vimeo' | 'instagram' }>, autoplay = false) =>
  src.kind === 'instagram'
    ? `https://www.instagram.com/${src.path}/${encodeURIComponent(src.id)}/embed`
    : src.kind === 'youtube'
    ? `https://www.youtube.com/embed/${encodeURIComponent(src.id)}?rel=0${autoplay ? '&autoplay=1' : ''}`
    : `https://player.vimeo.com/video/${encodeURIComponent(src.id)}${autoplay ? '?autoplay=1' : ''}`;

export const thumbnailUrl = (src: VideoSource) =>
  src.kind === 'youtube' ? `https://i.ytimg.com/vi/${encodeURIComponent(src.id)}/hqdefault.jpg` : null;

export const formatReviewDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};
