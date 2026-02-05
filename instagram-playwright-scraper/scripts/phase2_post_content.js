const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/* ================= CONFIG ================= */

const CREATOR_USERNAME = 'Khushiiimalhotra';
const CREATOR_NICHE = 'education';

const PHASE1_DIR = path.join(__dirname, '../data/phase1');
const OUTPUT_DIR = path.join(__dirname, '../data/phase2');

/* ================= HELPERS ================= */

function nowISO() {
  return new Date().toISOString();
}

function extractHashtags(text) {
  return text ? text.match(/#[a-zA-Z0-9_]+/g) || [] : [];
}

function unixToISO(ts) {
  return ts ? new Date(ts * 1000).toISOString() : null;
}

function findMedia(obj) {
  if (!obj || typeof obj !== 'object') return null;
  if (obj.shortcode && obj.taken_at_timestamp) return obj;
  for (const k of Object.keys(obj)) {
    const found = findMedia(obj[k]);
    if (found) return found;
  }
  return null;
}

/* ================= MAIN ================= */

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const phase1 = JSON.parse(
    fs.readFileSync(
      path.join(PHASE1_DIR, `post_index_${CREATOR_USERNAME}.json`),
      'utf-8'
    )
  );

  const postsIndex = phase1.posts_index;
  console.log(`📄 Loaded ${postsIndex.length} posts`);

  const browser = await chromium.launch({ headless: false, channel: 'chrome' });
  const context = await browser.newContext({
    storageState: 'instagram_login_state.json'
  });
  const page = await context.newPage();

  let networkMedia = null;
  let currentPostId = null;

  /* ========== HARDENED NETWORK LISTENER ========== */
  page.on('response', async response => {
    try {
      if (!currentPostId) return;

      const url = response.url();
      if (!url.includes('graphql') && !url.includes('/api/')) return;

      const ct = response.headers()['content-type'] || '';
      if (!ct.includes('application/json')) return;

      const json = await response.json().catch(() => null);
      if (!json) return;

      const media = findMedia(json);
      if (!media) return;

      if (media.shortcode !== currentPostId) return;

      networkMedia = media;
    } catch {
      // NEVER crash from network listener
    }
  });

  const results = [];
  let totalCommentsCollected = 0;

  /* ================= SCRAPE LOOP ================= */

  for (let i = 0; i < postsIndex.length; i++) {
    const post = postsIndex[i];
    console.log(`\n━━━━━━━━ POST ${i + 1}/${postsIndex.length} ━━━━━━━━`);

    currentPostId = post.post_id;
    networkMedia = null;

    try {
      await page.goto(post.reel_url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      await page.waitForTimeout(5000);

      /* ===== REELS ===== */
      if (post.post_type === 'reel') {
        const postedAt = await page.evaluate(() => {
          const t = document.querySelector('time');
          return t?.getAttribute('datetime') || null;
        });

        results.push({
          post_id: post.post_id,
          reel_url: post.reel_url,
          post_type: 'reel',
          extraction_mode: 'ui_only',
          extraction_status: 'success',

          posted_at: postedAt,
          scraped_at: nowISO(),

          caption: null,
          hashtags: [],
          hashtag_count: 0,
          metrics: {
            views: null,
            likes: null,
            comments_count: null,
            shares: null
          },
          comments_sample: []
        });

        continue;
      }

      /* ===== IMAGE / CAROUSEL ===== */
      console.log('🖼️ Image/Carousel detected → network extraction');

      let wait = 0;
      while (!networkMedia && wait < 10) {
        await page.waitForTimeout(500);
        wait++;
      }

      if (!networkMedia) {
        console.log('⚠️ Network payload not captured — recording fallback');

        results.push({
          post_id: post.post_id,
          reel_url: post.reel_url,
          post_type: post.post_type,
          extraction_mode: 'network',
          extraction_status: 'network_unavailable',

          posted_at: null,
          scraped_at: nowISO(),

          caption: null,
          hashtags: [],
          hashtag_count: 0,
          metrics: {
            views: null,
            likes: null,
            comments_count: null,
            shares: null
          },
          comments_sample: []
        });

        continue;
      }

      const caption =
        networkMedia.edge_media_to_caption?.edges?.[0]?.node?.text || '';

      const hashtags = extractHashtags(caption);

      results.push({
        post_id: post.post_id,
        reel_url: post.reel_url,
        post_type: post.post_type,
        extraction_mode: 'network',
        extraction_status: 'success',

        posted_at: unixToISO(networkMedia.taken_at_timestamp),
        scraped_at: nowISO(),

        caption,
        hashtags,
        hashtag_count: hashtags.length,

        metrics: {
          views: networkMedia.video_view_count || null,
          likes: networkMedia.edge_media_preview_like?.count || null,
          comments_count: networkMedia.edge_media_to_comment?.count || null,
          shares: null
        },

        comments_sample: []
      });

      totalCommentsCollected +=
        networkMedia.edge_media_to_comment?.count || 0;

    } catch (err) {
      console.log('❌ Post-level error — safely skipped');
    }

    // incremental save
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `post_content_partial_${CREATOR_USERNAME}.json`),
      JSON.stringify(results, null, 2)
    );
  }

  /* ================= FINAL OUTPUT ================= */

  fs.writeFileSync(
    path.join(OUTPUT_DIR, `post_content_${CREATOR_USERNAME}.json`),
    JSON.stringify({
      schema_version: '1.0',
      scrape_phase: 'post_content',
      creator_username: CREATOR_USERNAME,
      niche: CREATOR_NICHE,
      scrape_metadata: {
        scraped_at: nowISO(),
        scraper_type: 'playwright_ui_controlled',
        extraction_strategy: 'network_for_posts_ui_only_for_reels',
        scrape_mode: 'hybrid_defensive'
      },
      posts: results,
      summary: {
        posts_scraped: results.length,
        total_comments_collected: totalCommentsCollected
      }
    }, null, 2)
  );

  console.log('\n✅ Phase-2 Option B completed safely');
  await browser.close();
})();
