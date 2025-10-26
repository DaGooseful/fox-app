import { html, fixture, expect } from '@open-wc/testing';
import "../fox-app.js";

describe("FoxApp test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <fox-app
        title="title"
      ></fox-app>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
