import scrapy
import re

class MayoSupplementsSpider(scrapy.Spider):
    name = "mayo_supplements"
    allowed_domains = ["mayoclinic.org"]
    start_urls = ["https://www.mayoclinic.org/drugs-supplements"]

    @staticmethod
    def clean_text(text):
        # Remove unwanted escape sequences (like \r, \n, \t)
        cleaned_text = re.sub(r'[\r\n\t]', ' ', text)
        
        # Remove multiple spaces, reducing them to one space
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
        
        # Remove any HTML tags (if needed)
        cleaned_text = re.sub(r'<.*?>', '', cleaned_text)
        
        # Remove any URLs (optional)
        cleaned_text = re.sub(r'https?://[^\s]+', '', cleaned_text)
        
        # Optionally, remove any specific footnote references (like the references section at the end)
        cleaned_text = re.sub(r'Probiotics.*', '', cleaned_text)

        # Strip leading/trailing spaces
        cleaned_text = cleaned_text.strip()

        return cleaned_text

    def parse(self, response):
        """Extract A-Z filter links and featured supplement links"""
        letter_links = response.css("a.cmp-anchor--plain.cmp-button.cmp-button__link.cmp-button__inner--type-alphabetFacet::attr(href)").getall()
        supplement_links = response.css("li.cmp-link-list__item a")

        # Follow A-Z links
        for link in letter_links:
            yield response.follow(link, callback=self.parse_filtered_page)

        # Process supplement links (featured and listed)
        for link in supplement_links:
            supplement_name = link.css("::text").get(default="").strip()
            supplement_url = link.css("::attr(href)").get()

            if supplement_url:
                yield response.follow(supplement_url, callback=self.parse_supplement_article, meta={"title": supplement_name})

    def parse_filtered_page(self, response):
        """Extract all supplement and drug article links"""

        # Extract **BOTH types** of drug links
        drug_links = response.css(
            "a.cmp-anchor--plain.cmp-button.cmp-button__link.cmp-results-with-primary-name__see-link, "
            "a.cmp-anchor--plain.cmp-button.cmp-button__link.cmp-result-name__link"
        )

        if not drug_links:
            self.logger.warning(f"⚠ No drug links found on {response.url}")

        for link in drug_links:
            drug_name = link.css("::text").get(default="").strip()
            drug_url = link.css("::attr(href)").get()

            if drug_url:
                yield response.follow(drug_url, callback=self.parse_drug_article, meta={"title": drug_name})

    def parse_supplement_article(self, response):
        """Extract all text from the article div"""
        article_text = self.clean_text(response.css('div#main-content *::text').getall())

        yield {
            "url": response.url,
            "title": response.meta.get("title", "Unknown"),
            "content": article_text,
        }

    def parse_drug_article(self, response):
        """Extract all text from the article div"""
        article_text = self.clean_text(' '.join(response.css("div.drug *::text").getall()))

        yield {
            "url": response.url,
            "title": response.meta.get("title", "Unknown"),
            "content": article_text,
        }

