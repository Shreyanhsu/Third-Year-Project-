const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/* =====================================================
   CONFIG
   ===================================================== */

const CREATOR_USERNAME = 'dishaagarwalllll';
const CREATOR_NICHE = 'Beauty'; // set manually

const TARGET = {
  reels: 40,
  images: 30,
  carousels: 30
};

const MAX_TOTAL_POSTS = 120; // final guaranteed size
const MAX_SCROLLS = 150;
const MAX_NO_GROWTH = 5;

const OUTPUT_DIR = path.join(__dirname, '../data/phase1');

/* =====================================================
   HELPERS
   ===================================================== */

function nowISO() {
  return new Date().toISOString();
}

function extractPostId(url) {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

async function safeGoto(page, url) {
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForTimeout(4000);
}

/* =====================================================
   MAIN
   ===================================================== */

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome'
  });

  const context = await browser.newContext({
    storageState: 'instagram_login_state.json'
  });

  const page = await context.newPage();

  /* =====================================================
     STEP 0 — CREATOR METADATA
     ===================================================== */

  const profileUrl = `https://www.instagram.com/${CREATOR_USERNAME}/`;
  await safeGoto(page, profileUrl);

  const creatorMeta = await page.evaluate(() => {
    const header = document.querySelector('header');

    const verified =
      header?.querySelector('svg[aria-label="Verified"]') !== null;

    let followers = 'unknown';
    header?.querySelectorAll('span')?.forEach(s => {
      if (s.innerText?.includes('followers')) {
        followers = s.innerText.split(' ')[0];
      }
    });

    return { verified, followers };
  });

  /* =====================================================
     STEP 1 — COLLECT REELS
     ===================================================== */

  const collectedPosts = [];
  const allFoundUrls = new Set();
  const reelPool = new Set();
  let positionCounter = 1;

  console.log('🔵 Collecting reels...');
  await safeGoto(page, `${profileUrl}reels/`);

  let scrolls = 0;
  let noGrowth = 0;

  while (
    reelPool.size < 200 &&
    scrolls < MAX_SCROLLS &&
    noGrowth < MAX_NO_GROWTH
  ) {
    const before = reelPool.size;

    const urls = await page.$$eval('a', links =>
      links.map(l => l.href).filter(h => h.includes('/reel/'))
    );

    urls.forEach(u => {
      reelPool.add(u);
      allFoundUrls.add(u);
    });

    if (reelPool.size === before) noGrowth++;
    else noGrowth = 0;

    console.log(`Reels discovered: ${reelPool.size}`);

    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1200 + Math.random() * 1200);
    scrolls++;
  }

  // Take initial reel target
  for (const url of Array.from(reelPool).slice(0, TARGET.reels)) {
    collectedPosts.push({
      post_id: extractPostId(url),
      reel_url: url,
      position_on_profile: positionCounter++,
      post_type: 'reel',
      thumbnail_collected: false
    });
  }

  /* =====================================================
     STEP 2 — IMAGE / CAROUSEL CANDIDATES
     ===================================================== */

  console.log('🔵 Collecting image & carousel candidates...');
  await safeGoto(page, profileUrl);

  const postUrls = [];
  const seen = new Set();
  noGrowth = 0;

  while (postUrls.length < 150 && noGrowth < MAX_NO_GROWTH) {
    const before = seen.size;

    const urls = await page.$$eval('a', links =>
      links.map(l => l.href).filter(h => h.includes('/p/'))
    );

    urls.forEach(u => {
      allFoundUrls.add(u);
      if (!seen.has(u)) {
        seen.add(u);
        postUrls.push(u);
      }
    });

    if (seen.size === before) noGrowth++;
    else noGrowth = 0;

    console.log(`Post URLs found: ${postUrls.length}`);

    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1200 + Math.random() * 1200);
  }

  /* =====================================================
     STEP 3 — CLASSIFY IMAGE VS CAROUSEL
     ===================================================== */

  let imageCount = 0;
  let carouselCount = 0;

  for (const url of postUrls) {
    if (
      imageCount >= TARGET.images &&
      carouselCount >= TARGET.carousels
    ) {
      break;
    }

    await safeGoto(page, url);

    const isCarousel = await page.evaluate(() => {
      return (
        document.querySelector('button[aria-label="Next"]') !== null ||
        document.querySelectorAll('div[role="tablist"] button').length > 1
      );
    });

    if (isCarousel && carouselCount < TARGET.carousels) {
      collectedPosts.push({
        post_id: extractPostId(url),
        reel_url: url,
        position_on_profile: positionCounter++,
        post_type: 'carousel',
        thumbnail_collected: false
      });
      carouselCount++;
    } else if (!isCarousel && imageCount < TARGET.images) {
      collectedPosts.push({
        post_id: extractPostId(url),
        reel_url: url,
        position_on_profile: positionCounter++,
        post_type: 'image',
        thumbnail_collected: false
      });
      imageCount++;
    }
  }

  /* =====================================================
     STEP 4 — REEL FALLBACK (KEY PART)
     ===================================================== */

  if (collectedPosts.length < MAX_TOTAL_POSTS) {
    console.log('🔵 Filling gap with additional reels...');

    const used = new Set(collectedPosts.map(p => p.reel_url));

    for (const url of reelPool) {
      if (collectedPosts.length >= MAX_TOTAL_POSTS) break;
      if (used.has(url)) continue;

      collectedPosts.push({
        post_id: extractPostId(url),
        reel_url: url,
        position_on_profile: positionCounter++,
        post_type: 'reel',
        thumbnail_collected: false
      });
    }
  }

  /* =====================================================
     FINAL OUTPUT (REQUESTED FORMAT)
     ===================================================== */

  const output = {
    schema_version: '1.0',
    scrape_phase: 'post_index',
    creator: {
      creator_username: CREATOR_USERNAME,
      profile_url: profileUrl,
      niche: CREATOR_NICHE,
      followers_count_visible: creatorMeta.followers,
      verified: creatorMeta.verified
    },
    scrape_metadata: {
      scraped_at: nowISO(),
      scraper_type: 'playwright_ui_controlled',
      post_selection_strategy: 'balanced_with_reel_fallback',
      max_posts_collected: collectedPosts.length,
      scroll_behavior: 'manual_like_slow_scroll'
    },
    posts_index: collectedPosts,
    summary: {
      total_posts_found: allFoundUrls.size,
      posts_indexed: collectedPosts.length
    }
  };

  const outputFile = path.join(
    OUTPUT_DIR,
    `post_index_${CREATOR_USERNAME}.json`
  );

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`✅ Phase 1 JSON saved: ${outputFile}`);

  await browser.close();
})();
