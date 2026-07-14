const root = document.documentElement;
const widget = document.querySelector('[data-widget]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const shareButton = document.querySelector('[data-share]');
const statusLabel = document.querySelector('[data-status-label]');
const pageNote = document.querySelector('[data-page-note]');

const state = {
  profileName: 'ivuruGG',
  tagline: 'Developer × Gamer'
};

const savedTheme = localStorage.getItem('ivurugg-widget-theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  root.dataset.theme = savedTheme;
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = nextTheme;
  localStorage.setItem('ivurugg-widget-theme', nextTheme);
});

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && typeof value === 'string') {
    element.textContent = value;
  }
}

function renderStats(stats) {
  const container = document.querySelector('[data-stats]');
  if (!container || !Array.isArray(stats)) return;

  const fragment = document.createDocumentFragment();

  for (const stat of stats) {
    const card = document.createElement('article');
    card.className = 'stat-card';

    const label = document.createElement('span');
    label.className = 'stat-card__label';
    label.textContent = String(stat.label ?? '');

    const value = document.createElement('strong');
    value.textContent = String(stat.value ?? '');

    if (stat.suffix) {
      const suffix = document.createElement('small');
      suffix.textContent = ` ${stat.suffix}`;
      value.append(suffix);
    }

    const caption = document.createElement('span');
    caption.className = 'stat-card__caption';
    caption.textContent = String(stat.caption ?? '');

    card.append(label, value, caption);
    fragment.append(card);
  }

  container.replaceChildren(fragment);
}

function renderGames(games) {
  const container = document.querySelector('[data-games]');
  if (!container || !Array.isArray(games)) return;

  const fragment = document.createDocumentFragment();
  for (const game of games) {
    const tag = document.createElement('span');
    tag.textContent = String(game);
    fragment.append(tag);
  }

  container.replaceChildren(fragment);
}

function renderLinks(links) {
  const container = document.querySelector('[data-links]');
  if (!container || !Array.isArray(links)) return;

  container.querySelectorAll('a').forEach((link) => link.remove());

  for (const link of links) {
    if (!link?.url || !link?.label) continue;

    const anchor = document.createElement('a');
    anchor.href = String(link.url);
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
    anchor.textContent = String(link.label);
    container.insertBefore(anchor, shareButton ?? null);
  }
}

function renderProfile(profile) {
  const identity = profile?.identity ?? {};
  const project = profile?.project ?? {};
  const progress = Math.min(100, Math.max(0, Number(project.progress) || 0));

  state.profileName = String(identity.name ?? state.profileName);
  state.tagline = String(identity.tagline ?? state.tagline);

  setText('[data-status-label]', String(profile?.status?.label ?? 'ONLINE'));
  setText('[data-avatar-text]', String(identity.avatarText ?? 'iv'));
  setText('[data-profile-name]', state.profileName);
  setText('[data-profile-tagline]', state.tagline);
  setText('[data-profile-bio]', String(identity.bio ?? ''));
  setText('[data-project-eyebrow]', String(project.eyebrow ?? 'NOW BUILDING'));
  setText('[data-project-name]', String(project.name ?? 'Discord Profile Widget'));
  setText('[data-project-progress]', `${progress}%`);

  const progressTrack = document.querySelector('[data-progress-track]');
  const progressBar = document.querySelector('[data-progress-bar]');
  progressTrack?.setAttribute('aria-valuenow', String(progress));
  if (progressBar) progressBar.style.width = `${progress}%`;

  renderStats(profile?.stats);
  renderGames(profile?.games);
  renderLinks(profile?.links);

  document.title = `${state.profileName} Discord Widget`;
  widget?.setAttribute('aria-busy', 'false');
  if (pageNote) {
    pageNote.textContent = `Discord向けプロフィールウィジェット · API ${profile?.version ?? 'unknown'}`;
  }
}

async function loadProfile() {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch('/api/profile', {
      headers: { accept: 'application/json' },
      cache: 'no-store',
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Profile API returned ${response.status}`);
    }

    renderProfile(await response.json());
  } catch (error) {
    widget?.setAttribute('aria-busy', 'false');
    if (statusLabel) statusLabel.textContent = 'FALLBACK';
    if (pageNote) pageNote.textContent = 'APIに接続できないため、内蔵プロフィールを表示しています。';
    console.error('プロフィール情報の取得に失敗しました。', error);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

shareButton?.addEventListener('click', async () => {
  const shareData = {
    title: `${state.profileName} Discord Widget`,
    text: `${state.profileName} - ${state.tagline}`,
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    const originalText = shareButton.textContent;
    shareButton.textContent = 'Copied!';
    window.setTimeout(() => {
      shareButton.textContent = originalText;
    }, 1600);
  } catch (error) {
    if (error?.name !== 'AbortError') {
      console.error('共有処理に失敗しました。', error);
    }
  }
});

loadProfile();
