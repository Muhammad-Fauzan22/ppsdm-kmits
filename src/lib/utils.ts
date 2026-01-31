
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a Google Drive View/Preview URL to a Direct Download/Stream URL.
 * Also handles standard view URLs.
 * 
 * Input: https://drive.google.com/file/d/1abcde.../view?usp=sharing
 * Output: https://drive.google.com/uc?export=download&id=1abcde...
 */
export function convertDriveToDirectLink(url: string | null | undefined): string {
  if (!url) return "";

  // Return if already a direct link
  if (url.includes("drive.google.com/uc?")) return url;

  // Extract ID from /file/d/ID/view or /open?id=ID
  let id = "";
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      id = match[1];
      break;
    }
  }

  if (id) {
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }

  return url; // Fallback to original if regex fails
}
