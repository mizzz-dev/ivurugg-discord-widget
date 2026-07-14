const root = document.documentElement;
const themeToggle = document.querySelector('[data-theme-toggle]');
const shareButton = document.querySelector('[data-share]');

const savedTheme = localStorage.getItem('ivurugg-widget-theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  root.dataset.theme = savedTheme;
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = nextTheme;
  localStorage.setItem('ivurugg-widget-theme', nextTheme);
});

shareButton?.addEventListener('click', async () => {
  const shareData = {
    title: 'ivuruGG Discord Widget',
    text: 'ivuruGG - Developer × Gamer',
    url: window.location.href,
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
