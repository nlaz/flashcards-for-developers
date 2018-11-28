import visit from "./helpers/visit";

describe("When visiting the homepage", function() {
  it("it shows the app title to the user", async function() {
    const page = visit("/");

    const text = await page.evaluate(() => document.body.textContent).end();

    expect(text).toContain("Flashcards for Developers");
  });

  it("user should be able to visit the collections page", async function() {
    const page = visit("/");

    const location = await page
      .click(".collection-item:first-child .item-link")
      .evaluate(() => window.location)
      .end();

    expect(location.href).toContain("/collections/");
  });
});
