import scrapy

class MayoSymptomsSpider(scrapy.Spider):
    name = "mayo_symptoms"
    allowed_domains = ["mayoclinic.org"]
    start_urls = ["https://www.mayoclinic.org/symptoms"]

    def parse(self, response):
        """Extract A-Z filter links and follow them"""
        letter_links = response.css("ol.acces-alpha a::attr(href)").getall()

        for link in letter_links:
            yield response.follow(link, callback=self.parse_filtered_page)

    def parse_filtered_page(self, response):
        """Extract symptom article links and names"""
        symptom_links = response.css("div#index ol li a")

        for link in symptom_links:
            symptom_name = link.css("::text").get(default="").strip()
            symptom_url = link.css("::attr(href)").get()

            if symptom_url:
                yield response.follow(symptom_url, callback=self.parse_article, meta={"title": symptom_name})

    def parse_article(self, response):
        """Extract all text from the symptom article page"""
        article_text = response.css("#main-content p::text").getall()
        cleaned_text = " ".join(article_text).strip()

        yield {
            "url": response.url,
            "title": response.meta.get("title", "Unknown"),
            "content": cleaned_text,
        }

