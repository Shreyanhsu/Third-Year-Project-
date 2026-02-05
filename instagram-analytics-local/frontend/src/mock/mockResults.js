import { 
  instagramPosts, 
  calculateEngagementRate, 
  getUniqueCreators, 
  getTimeWindow, 
  formatNumber, 
  formatRange 
} from './instagramData';

/**
 * Find similar posts based on user input
 */
function findSimilarPosts(userInput) {
  const { caption, hashtags, category } = userInput;
  
  // Filter by category/niche
  let similar = instagramPosts.filter(post => {
    if (category && post.niche) {
      const categoryLower = category.toLowerCase();
      const nicheLower = post.niche.toLowerCase();
      return categoryLower === nicheLower || 
             categoryLower.includes(nicheLower) || 
             nicheLower.includes(categoryLower);
    }
    return true; // If no category match, include all
  });
  
  // Score posts based on similarity
  const scoredPosts = similar.map(post => {
    let score = 0;
    
    // Hashtag similarity
    if (hashtags && hashtags.length > 0 && post.hashtags) {
      const userHashtags = hashtags.map(h => h.toLowerCase());
      const postHashtags = post.hashtags.map(h => h.toLowerCase());
      const commonHashtags = userHashtags.filter(h => 
        postHashtags.some(ph => ph.includes(h) || h.includes(ph))
      );
      score += commonHashtags.length * 10;
    }
    
    // Caption keyword similarity (simple keyword matching)
    if (caption && post.caption) {
      const userWords = caption.toLowerCase().split(/\s+/);
      const postWords = post.caption.toLowerCase().split(/\s+/);
      const commonWords = userWords.filter(w => 
        w.length > 3 && postWords.some(pw => pw.includes(w) || w.includes(pw))
      );
      score += commonWords.length * 2;
    }
    
    // Hashtag count similarity
    if (hashtags && post.hashtagCount) {
      const userHashtagCount = hashtags.length;
      const diff = Math.abs(userHashtagCount - post.hashtagCount);
      score += Math.max(0, 10 - diff * 2);
    }
    
    return { ...post, similarityScore: score };
  });
  
  // Sort by similarity score and take top matches
  scoredPosts.sort((a, b) => b.similarityScore - a.similarityScore);
  
  // Return posts with score > 0, or top 50 if all scores are 0
  const filtered = scoredPosts.filter(p => p.similarityScore > 0);
  return filtered.length > 0 ? filtered : scoredPosts.slice(0, 50);
}

/**
 * Calculate performance ranges from similar posts
 */
function calculatePerformanceRanges(similarPosts) {
  if (similarPosts.length === 0) {
    return {
      views: { min: 0, max: 0, p25: 0, p75: 0 },
      engagement: { min: 0, max: 0, p25: 0, p75: 0 },
      likes: { min: 0, max: 0, p25: 0, p75: 0 },
      comments: { min: 0, max: 0, p25: 0, p75: 0 }
    };
  }
  
  // Extract metrics
  const views = similarPosts.map(p => p.views || 0).filter(v => v > 0);
  const engagementRates = similarPosts.map(p => p.engagementRate || 0).filter(e => e > 0);
  const likes = similarPosts.map(p => p.likes || 0).filter(l => l > 0);
  const comments = similarPosts.map(p => p.comments || 0).filter(c => c > 0);
  
  // Helper to calculate percentile
  const percentile = (arr, p) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.floor((p / 100) * sorted.length);
    return sorted[index] || sorted[sorted.length - 1];
  };
  
  return {
    views: {
      min: Math.min(...views),
      max: Math.max(...views),
      p25: percentile(views, 25),
      p75: percentile(views, 75)
    },
    engagement: {
      min: Math.min(...engagementRates),
      max: Math.max(...engagementRates),
      p25: percentile(engagementRates, 25),
      p75: percentile(engagementRates, 75)
    },
    likes: {
      min: Math.min(...likes),
      max: Math.max(...likes),
      p25: percentile(likes, 25),
      p75: percentile(likes, 75)
    },
    comments: {
      min: Math.min(...comments),
      max: Math.max(...comments),
      p25: percentile(comments, 25),
      p75: percentile(comments, 75)
    }
  };
}

/**
 * Analyze patterns in top vs bottom performing posts
 */
function analyzePatterns(similarPosts) {
  if (similarPosts.length === 0) {
    return {
      top: [],
      bottom: []
    };
  }
  
  // Sort by engagement rate
  const sorted = [...similarPosts].sort((a, b) => 
    (b.engagementRate || 0) - (a.engagementRate || 0)
  );
  
  const topQuartile = sorted.slice(0, Math.ceil(sorted.length * 0.25));
  const bottomQuartile = sorted.slice(-Math.ceil(sorted.length * 0.25));
  
  const patterns = {
    top: [],
    bottom: []
  };
  
  // Analyze hashtag patterns
  const topHashtagCounts = topQuartile.map(p => p.hashtagCount || 0);
  const bottomHashtagCounts = bottomQuartile.map(p => p.hashtagCount || 0);
  const avgTopHashtags = topHashtagCounts.reduce((a, b) => a + b, 0) / topHashtagCounts.length;
  const avgBottomHashtags = bottomHashtagCounts.reduce((a, b) => a + b, 0) / bottomHashtagCounts.length;
  
  if (avgTopHashtags > avgBottomHashtags + 1) {
    patterns.top.push(`Optimal hashtag count: ${Math.round(avgTopHashtags)} hashtags`);
  } else if (avgBottomHashtags > avgTopHashtags + 1) {
    patterns.bottom.push(`Too many hashtags (avg: ${Math.round(avgBottomHashtags)})`);
  }
  
  // Analyze caption length
  const topCaptionLengths = topQuartile.map(p => (p.caption || '').length);
  const bottomCaptionLengths = bottomQuartile.map(p => (p.caption || '').length);
  const avgTopCaption = topCaptionLengths.reduce((a, b) => a + b, 0) / topCaptionLengths.length;
  const avgBottomCaption = bottomCaptionLengths.reduce((a, b) => a + b, 0) / bottomCaptionLengths.length;
  
  if (avgTopCaption > 100 && avgTopCaption > avgBottomCaption + 50) {
    patterns.top.push("Longer, detailed captions (100+ characters)");
  } else if (avgBottomCaption < 50) {
    patterns.bottom.push("Very short captions (< 50 characters)");
  }
  
  // Analyze question hooks
  const topWithQuestions = topQuartile.filter(p => 
    (p.caption || '').includes('?') || 
    (p.caption || '').toLowerCase().includes('what') ||
    (p.caption || '').toLowerCase().includes('how') ||
    (p.caption || '').toLowerCase().includes('why')
  ).length;
  const bottomWithQuestions = bottomQuartile.filter(p => 
    (p.caption || '').includes('?') || 
    (p.caption || '').toLowerCase().includes('what') ||
    (p.caption || '').toLowerCase().includes('how') ||
    (p.caption || '').toLowerCase().includes('why')
  ).length;
  
  if (topWithQuestions > bottomWithQuestions) {
    patterns.top.push("Question-based hooks in captions");
    patterns.bottom.push("Missing engaging hooks or questions");
  }
  
  // Analyze CTA patterns
  const topWithCTA = topQuartile.filter(p => {
    const caption = (p.caption || '').toLowerCase();
    return caption.includes('comment') || 
           caption.includes('link') || 
           caption.includes('dm') ||
           caption.includes('save') ||
           caption.includes('share');
  }).length;
  
  if (topWithCTA > topQuartile.length * 0.5) {
    patterns.top.push("Clear call-to-action (CTA) in caption");
  } else {
    patterns.bottom.push("No clear call-to-action");
  }
  
  // Default patterns if none found
  if (patterns.top.length === 0) {
    patterns.top.push("Consistent posting schedule");
    patterns.top.push("Relevant niche-specific content");
  }
  if (patterns.bottom.length === 0) {
    patterns.bottom.push("Inconsistent engagement patterns");
  }
  
  return patterns;
}

/**
 * Generate improvement suggestions
 */
function generateSuggestions(userInput, similarPosts, patterns, performanceRanges) {
  const suggestions = [];
  
  // Hashtag suggestion
  const userHashtagCount = userInput.hashtags?.length || 0;
  const optimalHashtagCount = Math.round(
    similarPosts.slice(0, 10).reduce((sum, p) => sum + (p.hashtagCount || 0), 0) / 10
  );
  
  if (userHashtagCount === 0) {
    suggestions.push({
      observation: "Similar posts typically use hashtags",
      stat: `${optimalHashtagCount} hashtags on average`,
      action: `Consider adding ${optimalHashtagCount} relevant hashtags to improve discoverability`
    });
  } else if (Math.abs(userHashtagCount - optimalHashtagCount) > 2) {
    suggestions.push({
      observation: `You're using ${userHashtagCount} hashtags, but similar posts use ${optimalHashtagCount} on average`,
      stat: `${optimalHashtagCount} hashtags is optimal for this content type`,
      action: `Adjust to ${optimalHashtagCount} hashtags for better performance`
    });
  }
  
  // Caption length suggestion
  const userCaptionLength = (userInput.caption || '').length;
  const avgCaptionLength = Math.round(
    similarPosts.slice(0, 10).reduce((sum, p) => sum + (p.caption || '').length, 0) / 10
  );
  
  if (userCaptionLength < 50 && avgCaptionLength > 80) {
    suggestions.push({
      observation: "Your caption is shorter than similar high-performing posts",
      stat: `Top posts average ${avgCaptionLength} characters`,
      action: "Add more context or storytelling to your caption"
    });
  }
  
  // Engagement timing suggestion (mock)
  const peakHours = ["6 PM - 9 PM", "12 PM - 2 PM"];
  suggestions.push({
    observation: "Similar posts gain most traction during specific hours",
    stat: `Peak engagement: ${peakHours[0]}`,
    action: `Consider posting during ${peakHours[0]} for better initial visibility`
  });
  
  // Limit to 3 suggestions
  return suggestions.slice(0, 3);
}

/**
 * Analyze interaction patterns
 */
function analyzeInteractionPatterns(similarPosts) {
  // Mock interaction patterns based on data
  const avgEngagementRate = similarPosts.reduce((sum, p) => sum + (p.engagementRate || 0), 0) / similarPosts.length;
  
  let engagementSpeed = "Moderate";
  if (avgEngagementRate > 5) {
    engagementSpeed = "Fast";
  } else if (avgEngagementRate < 1) {
    engagementSpeed = "Slow";
  }
  
  const commentToLikeRatio = similarPosts.reduce((sum, p) => {
    if (p.likes && p.likes > 0) {
      return sum + ((p.comments || 0) / p.likes);
    }
    return sum;
  }, 0) / similarPosts.length;
  
  let commentPattern = "Passive";
  if (commentToLikeRatio > 0.1) {
    commentPattern = "Discussion-driven";
  } else if (commentToLikeRatio > 0.05) {
    commentPattern = "Moderate engagement";
  }
  
  return {
    engagementSpeed,
    commentPattern,
    avgEngagementRate: avgEngagementRate.toFixed(2)
  };
}

/**
 * Analyze time-based performance
 */
function analyzeTimePerformance(similarPosts) {
  // Mock time analysis
  const peakTime = "First 24 hours";
  const peakPercentage = "68%";
  
  return {
    peakTime,
    peakPercentage,
    insight: "Most similar posts gain the majority of their engagement within the first 24 hours"
  };
}

/**
 * Main mock analysis function
 */
export function runMockAnalysis(input) {
  // Find similar posts
  const similarPosts = findSimilarPosts(input);
  
  // Check if we have enough data
  if (similarPosts.length < 10) {
    return {
      status: "INSUFFICIENT_DATA",
      reason: `Only found ${similarPosts.length} similar posts. We need at least 10 historically similar posts to generate reliable insights. Try adjusting your category or adding more specific hashtags.`
    };
  }
  
  // Calculate performance ranges
  const performanceRanges = calculatePerformanceRanges(similarPosts);
  
  // Analyze patterns
  const patterns = analyzePatterns(similarPosts);
  
  // Generate suggestions
  const suggestions = generateSuggestions(input, similarPosts, patterns, performanceRanges);
  
  // Analyze interactions
  const interactionPatterns = analyzeInteractionPatterns(similarPosts);
  
  // Analyze time performance
  const timePerformance = analyzeTimePerformance(similarPosts);
  
  // Determine confidence level
  let confidence = "Medium";
  if (similarPosts.length >= 50) {
    confidence = "High";
  } else if (similarPosts.length < 20) {
    confidence = "Low";
  }
  
  // Get unique creators
  const uniqueCreators = getUniqueCreators(similarPosts);
  
  // Get time window
  const timeWindow = getTimeWindow(similarPosts);
  
  return {
    status: "SUCCESS",
    evidence: {
      similarPosts: similarPosts.length,
      creators: uniqueCreators,
      timeWindow: timeWindow,
      confidence: confidence
    },
    performance: {
      views: formatRange(performanceRanges.views.p25, performanceRanges.views.p75),
      engagement: `${performanceRanges.engagement.p25.toFixed(1)}% – ${performanceRanges.engagement.p75.toFixed(1)}%`,
      likes: formatRange(performanceRanges.likes.p25, performanceRanges.likes.p75),
      comments: formatRange(performanceRanges.comments.p25, performanceRanges.comments.p75),
      viewsMin: performanceRanges.views.min,
      viewsMax: performanceRanges.views.max,
      engagementMin: performanceRanges.engagement.min,
      engagementMax: performanceRanges.engagement.max
    },
    patterns: patterns,
    suggestions: suggestions,
    interactionPatterns: interactionPatterns,
    timePerformance: timePerformance
  };
}
