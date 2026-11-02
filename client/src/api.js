async function readReply(reply) {
  const body = await reply.json().catch(() => ({}));
  if (!reply.ok) throw new Error(body.message || 'Something went wrong.');
  return body;
}

export async function fetchSiteContent() {
  return readReply(await fetch('/api/content'));
}

export async function saveSiteContent(content, token) {
  return readReply(
    await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(content),
    })
  );
}

export async function sendFileToServer(kind, file, token) {
  const form = new FormData();
  form.append('file', file);
  return readReply(
    await fetch(`/api/upload/${kind}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
  );
}

/* Accepts a full YouTube link (watch, share, embed or shorts) or a bare video id */
export function pullYoutubeId(textFromOwner = '') {
  const text = textFromOwner.trim();
  if (/^[\w-]{11}$/.test(text)) return text;
  const match = text.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1] : '';
}
