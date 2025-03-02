# Scrapy settings for MayoScraper project

BOT_NAME = "MayoScraper"

SPIDER_MODULES = ["MayoScraper.spiders"]
NEWSPIDER_MODULE = "MayoScraper.spiders"

# 🚨 WARNING: Setting this to False ignores robots.txt rules
ROBOTSTXT_OBEY = False  

# 🛑 Avoid getting blocked by setting a custom User-Agent
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# 🍪 Enable cookies if needed (default is False)
COOKIES_ENABLED = False  

# 🚀 Enable AutoThrottle (adapts speed based on server response)
AUTOTHROTTLE_ENABLED = True  
AUTOTHROTTLE_START_DELAY = 2  
AUTOTHROTTLE_MAX_DELAY = 10  
AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0  

# 📥 Save scraped data (JSON, CSV, etc.)
FEEDS = {
    "output.json": {
        "format": "json",
        "encoding": "utf8",
        "indent": 4,
    },
}

# 📌 Custom Headers (Optional, helps avoid blocking)
DEFAULT_REQUEST_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en",
}

# 🛡️ Middleware settings
DOWNLOADER_MIDDLEWARES = {
    "scrapy.downloadermiddlewares.retry.RetryMiddleware": 550,
    "scrapy.downloadermiddlewares.useragent.UserAgentMiddleware": None,
}

# 📊 Logging Level (INFO, DEBUG, WARNING, ERROR)
LOG_LEVEL = "INFO"

