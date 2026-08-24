export type ChannelKind = "phone" | "mail" | "linkedin" | "other";

interface ChannelLike {
  label?: Partial<Record<string, string>> | null;
  url?: string | null;
}

// Channel labels are localized per-language, but recognizing which kind of
// channel an entry is needs to work regardless of the active locale — the
// raw English label and the URL scheme/host are the stable keys to match
// against, since matching a translated label string per-language would be
// unreliable.
export function getChannelKind(channel: ChannelLike): ChannelKind {
  const url = channel.url?.toLowerCase() ?? "";
  const englishLabel = channel.label?.en?.trim().toLowerCase() ?? "";

  if (url.startsWith("tel:") || englishLabel === "phone") return "phone";
  if (url.startsWith("mailto:") || englishLabel === "mail" || englishLabel === "email") return "mail";
  if (url.includes("linkedin.com") || englishLabel === "linkedin") return "linkedin";
  return "other";
}

export function isPhoneChannel(channel: ChannelLike): boolean {
  return getChannelKind(channel) === "phone";
}
