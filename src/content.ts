import type { Connection } from './types';

// Content script: Scrape connections from DOM and store in storage
function extractConnections() {
  const connections: Connection[] = [];
  // General approach: Find all profile links (updated for full URLs) and their adjacent elements for occupation
  const profileLinks = document.querySelectorAll('a[href*="/in/"]');
  console.log(`Found ${profileLinks.length} profile links on page`);
  if (profileLinks.length === 0) {
    console.log("No profile links found. Confirm you're on the connections page and scroll to load content.");
    console.log('Debug: Current page URL:', window.location.href);
    console.log('Debug: Page title:', document.title);
    // Enhanced debug: Log all a tags count and first few hrefs
    const allLinks = document.querySelectorAll('a');
    console.log('Debug: Total links on page:', allLinks.length);
    const inLinks = document.querySelectorAll('a[href*="in"]');
    console.log('Debug: Links with "in" in href:', inLinks.length);
    if (inLinks.length > 0) {
      const firstLink = inLinks[0] as HTMLAnchorElement;
      console.log('Debug: First profile-like link href and HTML:', firstLink.href, firstLink.outerHTML.substring(0, 500) + '...');
    }
    // Debug potential cards
    const potentialCards = document.querySelectorAll('div[role="listitem"], .artdeco-card, .scaffold-layout__list-container > div, [class*="entity"]');
    console.log('Debug: Potential card elements count:', potentialCards.length);
    if (potentialCards.length > 0) {
      console.log('Debug: First potential card HTML:', potentialCards[0].outerHTML.substring(0, 500) + '...');
    }
    return;
  }
  profileLinks.forEach((link) => {
    const name = (link as HTMLElement).innerText.trim();
    if (!name || name.length < 2) return; // Skip invalid names
    // Find occupation in parent or sibling elements (expanded)
    const parent = link.closest('div[role="listitem"], .artdeco-card, .scaffold-layout__list-container > div, [class*="entity"], [class*="search"], [class*="card"], [class*="lockup"], [class*="result"]') || link.parentElement;
    if (!parent) return;
    // Look for occupation in sibling or child elements (expanded selectors)
    const occupationCandidates = parent.querySelectorAll('[class*="subtitle"], [class*="caption"], [class*="summary"], [class*="description"], [class*="metadata"], [class*="headline"], p, span, .entity-result__primary-subtitle, .artdeco-entity-lockup__caption');
    let occupation = '';
    for (const candidate of occupationCandidates) {
      const text = (candidate as HTMLElement).innerText.trim();
      if (text && text !== name && text.length > 5 && !text.includes('View') && !text.includes('Message') && !text.includes('LinkedIn')) {
        occupation = text;
        break;
      }
    }
    if (!occupation) {
      // Fallback: Look in next sibling or parent text
      const nextSibling = link.parentElement?.nextElementSibling;
      if (nextSibling) {
        occupation = (nextSibling as HTMLElement).innerText.trim();
      } else {
        occupation = (parent as HTMLElement).innerText.trim().split('\n')[1] || ''; // Fallback to second line in parent
      }
    }
    if (occupation && !connections.some(c => c.name === name)) {
      const id = name.replace(/\s+/g, '_').toLowerCase();
      const companyMatch = occupation.match(/ at (.+?)(?=\s|$)/i); // Improved regex for company
      const company = companyMatch ? companyMatch[1].trim() : '';
      const position = occupation.replace(/ at .+$/i, '').trim() || occupation;
      // Profile picture: Look in parent or grandparent for img (expanded)
      const picEl = parent.querySelector('img[alt*="profile"], img[data-delayed-url], img[src*="linkedin"], img[alt*="photo"], .entity-result__thumbnail img, .artdeco-entity-lockup__image img') || parent.parentElement?.querySelector('img');
      const profilePicture = picEl ? (picEl as HTMLImageElement).src || (picEl as HTMLImageElement).getAttribute('data-delayed-url') || '' : '';
      connections.push({ 
        id,
        name, 
        occupation,
        company,
        position,
        profilePicture,
        companyLogo: ''
      });
      console.log(`Extracted connection ${connections.length}: ${name} - ${position} at ${company}`);
    }
  });

  // Store in local storage
  chrome.storage.local.set({ connections });
  console.log(`Extracted and stored ${connections.length} connections`);
}

function delayedExtraction() {
  setTimeout(extractConnections, 3000); // Delay for dynamic content load
}

// Run extraction on load and observe for dynamic content
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', delayedExtraction);
} else {
  delayedExtraction();
}

// Optional: Observe for new connections loaded via scroll/pagination
const observer = new MutationObserver(() => {
  delayedExtraction();
});
observer.observe(document.body, { childList: true, subtree: true });

// Optional: Scroll to load more (simulate user scroll) - commented out to avoid unused warning
/*
function scrollToLoadMore() {
  let lastHeight = 0;
  const interval = setInterval(() => {
    window.scrollTo(0, document.body.scrollHeight);
    if (document.body.scrollHeight === lastHeight) {
      clearInterval(interval);
    }
    lastHeight = document.body.scrollHeight;
  }, 2000);
}
*/

// Uncomment to auto-scroll (use ethically, may trigger anti-bot)
// scrollToLoadMore();
