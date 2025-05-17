/**
 * Performance optimization utilities
 */

/**
 * Defers non-critical operations until after the page has loaded
 * @param callback Function to execute after the page has loaded
 * @param delay Optional delay in milliseconds (default: 100ms)
 */
export function deferOperation(callback: () => void, delay = 100): void {
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete') {
      // If page is already loaded, delay execution slightly to allow UI to render
      setTimeout(callback, delay);
    } else {
      // Otherwise wait for the page to finish loading
      window.addEventListener('load', () => setTimeout(callback, delay));
    }
  }
}

/**
 * Loads data in chunks to avoid blocking the main thread
 * @param items Array of items to process
 * @param processItem Function to process each item
 * @param chunkSize Number of items to process in each chunk (default: 5)
 * @param delay Delay between chunks in milliseconds (default: 10ms)
 */
export function processInChunks<T>(
  items: T[],
  processItem: (item: T) => void,
  chunkSize = 5,
  delay = 10
): void {
  let index = 0;

  function processNextChunk() {
    const end = Math.min(index + chunkSize, items.length);
    
    for (let i = index; i < end; i++) {
      processItem(items[i]);
    }
    
    index = end;
    
    if (index < items.length) {
      setTimeout(processNextChunk, delay);
    }
  }

  processNextChunk();
}

/**
 * Lazy loads images that are not in the viewport
 * @param imageSelector CSS selector for images to lazy load
 * @param rootMargin Root margin for IntersectionObserver (default: "200px")
 */
export function setupLazyLoading(
  imageSelector = 'img.lazy',
  rootMargin = '200px'
): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const loadImage = (image: HTMLImageElement) => {
    const src = image.dataset.src;
    if (!src) return;
    
    image.src = src;
    image.classList.add('loaded');
    image.classList.remove('lazy');
    observer.unobserve(image);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(entry.target as HTMLImageElement);
        }
      });
    },
    { rootMargin }
  );

  deferOperation(() => {
    const images = document.querySelectorAll(imageSelector);
    images.forEach((image) => observer.observe(image));
  });
}

/**
 * Prefetches critical resources
 * @param urls Array of URLs to prefetch
 */
export function prefetchResources(urls: string[]): void {
  if (typeof window === 'undefined') return;
  
  deferOperation(() => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  });
}
