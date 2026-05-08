function normKey(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

export function getProviderLogoUri(providerName) {
  const slug = ({
    gopay: 'gopay',
    shopeepay: 'shopeepay',
    dana: 'dana',
  })[normKey(providerName)];
  if (!slug) return null;

  const colorsBySlug = {
    gopay: '00AAB4',
    shopeepay: 'EE4D2D',
    dana: '118EEA',
  };
  const hex = colorsBySlug[slug];
  return `https://cdn.simpleicons.org/${slug}/${hex}`;
}

export function getProviderFallbackTint(providerName) {
  const t = ({
    gopay: '#00AAB4',
    shopeepay: '#EE4D2D',
    dana: '#118EEA',
  })[normKey(providerName)];
  return t || '#5C6BC0';
}

export function providerInitial(providerName) {
  const raw = String(providerName || '').trim();
  return raw.slice(0, 1).toUpperCase() || '?';
}
