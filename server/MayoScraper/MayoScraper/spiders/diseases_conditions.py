import scrapy
import re

class MayoDiseasesSpider(scrapy.Spider):
    name = "mayo_diseases"
    allowed_domains = ["mayoclinic.org"]
    start_urls = ["https://www.mayoclinic.org/diseases-conditions"]

    def parse(self, response):
        """Extract A-Z filter links and follow them"""
        letter_links = response.css("a.cmp-anchor--plain.cmp-button.cmp-button__link.cmp-button__inner--type-alphabetFacet::attr(href)").getall()

        for link in letter_links:
            yield response.follow(link, callback=self.parse_filtered_page)

    def parse_filtered_page(self, response):
        """Extract disease links along with their titles and follow them"""
        disease_links = response.css("a.cmp-anchor--plain.cmp-button.cmp-button__link.cmp-results-with-primary-name__see-link, a.cmp-anchor--plain.cmp-button.cmp-button__link.cmp-result-name__link")

        for link in disease_links:
            url = link.css("::attr(href)").get()
            title = link.css("::text").get(default="").strip()

            if url:
                yield response.follow(url, callback=self.parse_article, meta={"title": title})

    def parse_article(self, response):
        """Extract all text from the article content div"""
        article_text = response.css("div.content > div:not([class]) :not(.requestappt):not(.contentbox.no-order) *::text").getall()

        cleaned_text = " ".join(article_text).strip()
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
        cleaned_text = cleaned_text.replace("\n", " ").replace("\r", "")
        yield {
            "url": response.url,
            "title": response.meta.get("title", "Unknown Title"),
            "content": cleaned_text,
        }
