import csv
import json
import re
import io
from datetime import datetime

def parse_number(value):
    """Parse numbers with K, M suffixes"""
    if not value or value == 'null' or value == '':
        return None
    
    value = str(value).strip()
    
    # Handle K suffix (thousands)
    if 'K' in value.upper():
        num = float(re.sub(r'[^\d.]', '', value))
        return int(num * 1000)
    
    # Handle M suffix (millions)
    if 'M' in value.upper():
        num = float(re.sub(r'[^\d.]', '', value))
        return int(num * 1000000)
    
    # Regular number
    try:
        return int(float(value))
    except:
        return None

def parse_hashtags(hashtag_string):
    """Parse hashtags from string"""
    if not hashtag_string or hashtag_string == 'null' or hashtag_string == '':
        return []
    
    # Split by # and filter empty
    hashtags = re.split(r'[#,\s]+', hashtag_string)
    hashtags = [h.strip() for h in hashtags if h.strip()]
    return hashtags

def parse_date(date_string):
    """Parse various date formats"""
    if not date_string or date_string == 'null' or date_string == '':
        return None
    
    # Try to parse ISO format first
    try:
        # Handle ISO format with timezone
        if 'T' in date_string:
            dt = datetime.fromisoformat(date_string.replace('+05:30', ''))
            return dt.strftime('%Y-%m-%d')
    except:
        pass
    
    # Try other formats
    formats = [
        '%d-%b-%y', '%d-%m-%Y', '%Y-%m-%d', 
        '%d-%b-%Y', '%b-%d-%y', '%b-%d-%Y',
        '%d/%m/%Y', '%m/%d/%Y'
    ]
    
    for fmt in formats:
        try:
            dt = datetime.strptime(date_string, fmt)
            return dt.strftime('%Y-%m-%d')
        except:
            continue
    
    return None

def calculate_engagement_rate(views, likes, comments, shares):
    """Calculate engagement rate"""
    if not views or views == 0:
        return 0.0
    
    total_engagement = (likes or 0) + (comments or 0) + (shares or 0)
    return round((total_engagement / views) * 100, 2)

# Read CSV file
csv_file = '../data/Instagram Data - Sheet1.csv'
posts = []

# Try different encodings
encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
file_content = None
used_encoding = None

for encoding in encodings:
    try:
        with open(csv_file, 'r', encoding=encoding) as f:
            file_content = f.read()
            used_encoding = encoding
            break
    except:
        continue

if not file_content:
    print("Error: Could not read CSV file with any encoding")
    exit(1)

# Parse CSV from string
f = io.StringIO(file_content)
reader = csv.DictReader(f)

for row in reader:
    # Skip empty rows
    if not row.get('post_id') or row.get('post_id').strip() == '':
        continue
    
    # Parse data
    creator = row.get('creator_username', '').strip()
    niche = row.get('niche', '').strip() or None
    caption = row.get('caption', '').strip() or ''
    hashtag_string = row.get('hashtags', '').strip()
    hashtags = parse_hashtags(hashtag_string)
    hashtag_count = int(row.get('hashtag_count', 0) or 0)
    
    views = parse_number(row.get('views'))
    likes = parse_number(row.get('likes'))
    comments = parse_number(row.get('comments_count'))
    shares = parse_number(row.get('shares'))
    
    posted_at = parse_date(row.get('posted_at'))
    
    # Calculate engagement rate
    engagement_rate = calculate_engagement_rate(views, likes, comments, shares)
    
    # Only include posts with valid data
    if creator and (views or likes):
        posts.append({
            'creator': creator,
            'niche': niche,
            'caption': caption,
            'hashtags': hashtags,
            'hashtagCount': hashtag_count,
            'views': views,
            'likes': likes,
            'comments': comments,
            'shares': shares,
            'postedAt': posted_at,
            'engagementRate': engagement_rate
        })

# Generate JavaScript file
js_content = """// This file contains processed Instagram data from the CSV
// Generated automatically from Instagram Data - Sheet1.csv
// Total posts: {count}

export const instagramPosts = {data};

// Helper function to calculate engagement rate
export function calculateEngagementRate(views, likes, comments, shares) {{
  if (!views || views === 0) return 0;
  const totalEngagement = (likes || 0) + (comments || 0) + (shares || 0);
  return (totalEngagement / views) * 100;
}}

// Get unique creators count
export function getUniqueCreators(posts) {{
  return new Set(posts.map(p => p.creator)).size;
}}

// Get time window from posts
export function getTimeWindow(posts) {{
  if (posts.length === 0) return "N/A";
  const dates = posts.map(p => new Date(p.postedAt)).filter(d => !isNaN(d.getTime()));
  if (dates.length === 0) return "N/A";
  
  const sorted = dates.sort((a, b) => a - b);
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];
  
  const formatDate = (date) => {{
    const month = date.toLocaleString('default', {{ month: 'short' }});
    return `${{month}} ${{date.getFullYear()}}`;
  }};
  
  return `${{formatDate(oldest)}} – ${{formatDate(newest)}}`;
}}

// Format numbers for display
export function formatNumber(num) {{
  if (!num) return "0";
  if (num >= 1000000) return `${{(num / 1000000).toFixed(1)}}M`;
  if (num >= 1000) return `${{(num / 1000).toFixed(1)}}K`;
  return num.toString();
}}

// Format range for display
export function formatRange(min, max) {{
  return `${{formatNumber(min)}} – ${{formatNumber(max)}}`;
}}
""".format(
    count=len(posts),
    data=json.dumps(posts, indent=2, ensure_ascii=False)
)

# Write to JavaScript file
output_file = '../frontend/src/mock/instagramData.js'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"✅ Successfully parsed {len(posts)} posts from CSV")
print(f"✅ Generated {output_file}")
print(f"✅ Unique creators: {len(set(p['creator'] for p in posts))}")
print(f"✅ Niches: {', '.join(set(p['niche'] for p in posts if p['niche']))}")

