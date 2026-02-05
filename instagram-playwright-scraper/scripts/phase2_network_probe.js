const { chromium } = require('playwright');

/* ================= CONFIG ================= */

const TEST_POST_URL =
  'https://www.instagram.com/reel/DUQrWURjxhG/';
const TARGET_SHORTCODE = 'DUQrWURjxhG';

/* ================= HELPERS ================= */

// Recursively search object for media with matching shortcode
function findMedia(obj, target) {
  if (!obj || typeof obj !== 'object') return null;

  if (obj.shortcode === target) return obj;

  for (const key of Object.keys(obj)) {
    const found = findMedia(obj[key], target);
    if (found) return found;
  }
  return null;
}

/* ================= MAIN ================= */

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome'
  });

  const context = await browser.newContext({
    storageState: 'instagram_login_state.json'
  });

  const page = await context.newPage();

  console.log('🛰️ Attaching network listener (deep parse mode)...');

  page.on('response', async response => {
    try {
      const url = response.url();

      // Only consider Instagram data endpoints
      if (
        !url.includes('graphql') &&
        !url.includes('/api/')
      ) return;

      const ct = response.headers()['content-type'] || '';
      if (!ct.includes('application/json')) return;

      const json = await response.json().catch(() => null);
      if (!json) return;

      const media = findMedia(json, TARGET_SHORTCODE);
      if (!media) return;

      console.log('\n🎯 TARGET POST DATA CAPTURED (NETWORK)');

      const caption =
        media.edge_media_to_caption?.edges?.[0]?.node?.text || '';

      const hashtags =
        caption.match(/#[a-zA-Z0-9_]+/g) || [];

      console.log('📅 Posted at (unix):', media.taken_at_timestamp);
      console.log('📝 Caption:', caption);
      console.log('🏷️ Hashtags:', hashtags);
      console.log('👀 Views:', media.video_view_count);
      console.log('❤️ Likes:', media.edge_media_preview_like?.count);
      console.log('💬 Comments:', media.edge_media_to_comment?.count);

      console.log('\n✅ NETWORK EXTRACTION SUCCESSFUL\n');
    } catch (err) {
      // intentionally silent
    }
  });

  console.log('➡️ Opening test post...');
  await page.goto(TEST_POST_URL, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // 🔥 Force interactions to trigger API calls
  console.log('🧩 Triggering UI interactions...');
  await page.mouse.click(300, 300);
  await page.waitForTimeout(1000);
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(8000);

  await browser.close();
})();
