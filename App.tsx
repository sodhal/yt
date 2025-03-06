import React, { useState, useEffect } from 'react';
import { Search, Download, Youtube, Image, ExternalLink, Home, Info, Mail, Shield } from 'lucide-react';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [thumbnails, setThumbnails] = useState<{[key: string]: string}>({});
  const [videoTitle, setVideoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('home');

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : '';
  };

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
      setIsLoading(true);
      setError('');
    } else {
      setError('Please enter a valid YouTube URL');
      setVideoId('');
      setThumbnails({});
      setVideoTitle('');
    }
  };

  // Fetch thumbnail data when videoId changes
  useEffect(() => {
    if (!videoId) return;

    const fetchThumbnailData = async () => {
      try {
        // In a real application, you would use a backend API to fetch video data
        // For this demo, we'll generate the thumbnail URLs directly
        
        // Generate thumbnail URLs for different qualities
        const thumbnailData = {
          'Maxres (1280x720)': `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          'Standard (640x480)': `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          'High (480x360)': `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          'Medium (320x180)': `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          'Default (120x90)': `https://img.youtube.com/vi/${videoId}/default.jpg`,
        };
        
        setThumbnails(thumbnailData);
        
        // For demo purposes, we'll set a placeholder title
        // In a real app, you would fetch this from the YouTube API
        setVideoTitle('YouTube Video Thumbnail');
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching thumbnail data:', error);
        setError('Failed to fetch thumbnail data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchThumbnailData();
  }, [videoId]);

  // Download thumbnail function
  const downloadThumbnail = (url: string, quality: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `youtube-thumbnail-${videoId}-${quality.toLowerCase().replace(/\s/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render the current page
  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutUs setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <ContactUs setCurrentPage={setCurrentPage} />;
      case 'privacy':
        return <PrivacyPolicy setCurrentPage={setCurrentPage} />;
      default:
        return renderHomePage();
    }
  };

  // Render the home page content
  const renderHomePage = () => {
    return (
      <>
        {/* Main Content */}
        <main className="container py-8">
          {/* URL Input Form */}
          <div className="card max-w-3xl mx-auto p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Enter YouTube Video URL</h2>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Youtube className="text-light" size={20} />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="input input-with-icon"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="spinner mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Search className="mr-1" size={18} />
                    Get Thumbnails
                  </span>
                )}
              </button>
            </form>
            {error && <p className="text-error mt-2">{error}</p>}
          </div>

          {/* Results Section */}
          {videoId && Object.keys(thumbnails).length > 0 && (
            <div className="card max-w-4xl mx-auto p-6">
              <h2 className="text-xl font-semibold mb-4">Available Thumbnails</h2>
              <div className="mb-4">
                <p>
                  <span className="font-medium">Video ID:</span> {videoId}
                </p>
                {videoTitle && (
                  <p className="mt-1">
                    <span className="font-medium">Title:</span> {videoTitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(thumbnails).map(([quality, url], index) => (
                  <div 
                    key={quality} 
                    className={`thumbnail-container ${
                      index === 0 ? "lg:col-span-2" : ""
                    }`}
                  >
                    <div className="thumbnail-header">
                      <h3 className="font-medium">{quality}</h3>
                    </div>
                    <div className="thumbnail-body">
                      <div className="thumbnail-image-container">
                        <img 
                          src={url} 
                          alt={`${quality} thumbnail`} 
                          className="thumbnail-image"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/480x360?text=Not+Available';
                            target.alt = 'Thumbnail not available';
                          }}
                        />
                      </div>
                      <div className="thumbnail-actions sm:flex-row gap-2">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary flex-1 mb-2 sm:mb-0"
                        >
                          <ExternalLink className="mr-1" size={16} />
                          Preview
                        </a>
                        <button
                          onClick={() => downloadThumbnail(url, quality)}
                          className="btn btn-success flex-1"
                        >
                          <Download className="mr-1" size={16} />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Use Section */}
          <div className="card max-w-4xl mx-auto mt-12 p-6">
            <h2 className="text-xl font-semibold mb-4">How to Use YouTube-Thumbnail-Save.com</h2>
            <ol className="list-decimal space-y-2">
              <li>Copy the URL of the YouTube video you want to extract thumbnails from.</li>
              <li>Paste the URL into the input field above.</li>
              <li>Click the "Get Thumbnails" button.</li>
              <li>Preview or download thumbnails in your preferred quality.</li>
            </ol>
          </div>

          {/* SEO Content */}
          <div className="card max-w-4xl mx-auto mt-12 p-6">
            <h2 className="text-xl font-semibold mb-4">Why Use YouTube-Thumbnail-Save.com?</h2>
            <div className="prose max-w-none">
              <p>
                At <strong>YouTube-Thumbnail-Save.com</strong>, we understand how crucial thumbnails are for content creators. They're the first thing viewers see and can make or break your click-through rates. Our free YouTube thumbnail downloader tool is designed specifically to help creators like you:
              </p>
              <ul className="list-disc mt-2 space-y-1">
                <li>Recover lost thumbnail files in their original high quality (up to 1280x720)</li>
                <li>Study successful thumbnails from top creators for inspiration and competitive analysis</li>
                <li>Create consistent branding across YouTube, social media, and marketing materials</li>
                <li>Access thumbnails in multiple resolutions for different platforms and use cases</li>
                <li>Save valuable time with our instant, no-signup thumbnail extraction process</li>
              </ul>
              <p className="mt-4">
                Whether you're a YouTube content creator, digital marketer, social media manager, or graphic designer, <strong>YouTube-Thumbnail-Save.com</strong> provides the simplest way to download YouTube thumbnails in all available qualities. From standard definition to maximum resolution, we've got you covered.
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-2">The Ultimate YouTube Thumbnail Tool for Creators</h3>
              <p>
                Unlike other thumbnail downloaders, <strong>YouTube-Thumbnail-Save.com</strong> offers a clean, ad-free experience focused on what matters most: getting high-quality thumbnails quickly and easily. Our tool works with any public YouTube video and provides instant access to all available thumbnail resolutions.
              </p>
              <p className="mt-4">
                Content creation is challenging enough. Let <strong>YouTube-Thumbnail-Save.com</strong> simplify your workflow by providing easy access to the thumbnails you need, when you need them. No software to install, no accounts to create, and no technical knowledge required.
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-2">Common Uses for YouTube Thumbnails</h3>
              <p>
                Our users at <strong>YouTube-Thumbnail-Save.com</strong> download thumbnails for various purposes:
              </p>
              <ul className="list-disc mt-2 space-y-1">
                <li>Creating video playlists with thumbnail previews</li>
                <li>Designing promotional materials for YouTube channels</li>
                <li>Including video thumbnails in blog posts and articles</li>
                <li>Analyzing thumbnail design trends in specific niches</li>
                <li>Recovering thumbnails from your own videos for portfolio use</li>
                <li>Creating comparison graphics for video marketing strategies</li>
              </ul>
            </div>
          </div>

          {/* Additional SEO Content */}
          <div className="card max-w-4xl mx-auto mt-12 p-6">
            <h2 className="text-xl font-semibold mb-4">YouTube Thumbnail Quality Guide</h2>
            <div className="prose max-w-none">
              <p>
                At <strong>YouTube-Thumbnail-Save.com</strong>, we provide thumbnails in all available qualities. Here's what each quality level means:
              </p>
              <ul className="mt-4 space-y-4">
                <li>
                  <strong>Maxres (1280x720)</strong>: The highest quality thumbnail available, perfect for professional use in marketing materials, presentations, and high-resolution displays. Not all videos have this quality available.
                </li>
                <li>
                  <strong>Standard (640x480)</strong>: Great quality for most digital uses, including social media posts, blog articles, and medium-sized displays.
                </li>
                <li>
                  <strong>High (480x360)</strong>: Good quality for smaller digital uses, email newsletters, and mobile-optimized content.
                </li>
                <li>
                  <strong>Medium (320x180)</strong>: Suitable for small preview images, mobile applications, and situations where bandwidth conservation is important.
                </li>
                <li>
                  <strong>Default (120x90)</strong>: The smallest thumbnail size, primarily used for minimal preview icons and extremely bandwidth-restricted applications.
                </li>
              </ul>
              <p className="mt-4">
                For most content creators, we recommend downloading the highest quality available (Maxres or Standard) to ensure maximum flexibility in how you use the thumbnails. With <strong>YouTube-Thumbnail-Save.com</strong>, you can always access all available qualities with just one click.
              </p>
            </div>
          </div>
        </main>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="flex items-center justify-center">
            <Youtube className="mr-2" size={32} />
            <h1 className="text-2xl md:text-3xl font-bold text-center">YouTube Thumbnail Downloader</h1>
          </div>
          <p className="text-center mt-2 max-w-2xl mx-auto">
            Download YouTube video thumbnails in all available qualities for free at YouTube-Thumbnail-Save.com
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <ul className="nav-list">
            <li className="nav-item">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`nav-link ${currentPage === 'home' ? 'nav-link-active' : ''}`}
              >
                <Home size={16} className="mr-1" />
                <span>Home</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => setCurrentPage('about')}
                className={`nav-link ${currentPage === 'about' ? 'nav-link-active' : ''}`}
              >
                <Info size={16} className="mr-1" />
                <span>About Us</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => setCurrentPage('contact')}
                className={`nav-link ${currentPage === 'contact' ? 'nav-link-active' : ''}`}
              >
                <Mail size={16} className="mr-1" />
                <span>Contact Us</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => setCurrentPage('privacy')}
                className={`nav-link ${currentPage === 'privacy' ? 'nav-link-active' : ''}`}
              >
                <Shield size={16} className="mr-1" />
                <span>Privacy Policy</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Render the current page */}
      {renderPage()}

      {/* Footer */}
      <footer className="footer mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center justify-center md:justify-start">
                <Image className="mr-2" size={24} />
                <h2 className="text-xl font-bold">YouTube-Thumbnail-Save.com</h2>
              </div>
              <p className="footer-text text-center md:text-left mt-1">
                The simplest way to download YouTube thumbnails in high quality
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="footer-text">
                &copy; {new Date().getFullYear()} YouTube-Thumbnail-Save.com. All rights reserved.
              </p>
              <p className="footer-text mt-1">
                This tool is not affiliated with YouTube or Google Inc.
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <ul className="flex flex-wrap justify-center space-x-4">
              <li><button onClick={() => setCurrentPage('home')} className="footer-link">Home</button></li>
              <li><button onClick={() => setCurrentPage('about')} className="footer-link">About Us</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="footer-link">Contact Us</button></li>
              <li><button onClick={() => setCurrentPage('privacy')} className="footer-link">Privacy Policy</button></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;