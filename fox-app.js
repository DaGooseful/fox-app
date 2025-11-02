/**
 * Copyright 2025 
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js"; //This i have chatgpt give me suggestion on emote
import "@haxtheweb/simple-icon/lib/simple-icons.js"; //They sad this would work

/**
 * `fox-app`
 */
export class FoxApp extends DDDSuper(I18NMixin(LitElement)) { //Class header
  static get tag() {
    return "fox-app";
  }

  static get properties() {
    return {
      ...super.properties,
      gallery: { type: Array },
      likes: { type: Object },
    };
  }

  constructor() {
    super();
    this.gallery = [];
    this.likes = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadGallery();
    this.loadLikes();
  }

  async loadGallery() { //Spended a lot of time on this, thankfully with the help of chatgpt error checking it work
    try {
      const res = await fetch(
        new URL("./NewAssetsIThink/fox-picGalley.json", import.meta.url)
      );
      const data = await res.json();
      this.gallery = data.gallery;
    } catch (err) {
      console.error("Error loading gallery:", err);
    }
  }

  loadLikes() { //Our storage that load the likes
    const saved = localStorage.getItem("foxGalleryLikes");
    if (saved) {
      this.likes = JSON.parse(saved);
    }
  }

  saveLikes() { //Thius save our likes
    localStorage.setItem("foxGalleryLikes", JSON.stringify(this.likes));
  }

  handleLike(id) { //This increase likes
    this.likes[id] = (this.likes[id] || 0) + 1;
    this.saveLikes();
    this.requestUpdate();
  }

  async handleShare(url) {
    if (navigator.share) {
      try {
        await navigator.share({ //Our text when we share
          text: "Look at this fox I found working on this project",
          url,
        });
      } catch (err) { //IST 242 came in clutch here
        console.warn("Share canceled or failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }

  static get styles() { //Our styles
    return [
      super.styles,
      css`
        :host {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ddd-spacing-4, 16px);
          background-color: var(--ddd-theme-background, #f9f9f9);
          padding: var(--ddd-spacing-4, 16px);
          box-sizing: border-box;
          color: var(--ddd-theme-primary, #000);
          font-family: var(--ddd-font-navigation);
        }

        .card {
          width: 100%;
          max-width: 400px;
          background-color: var(--ddd-theme-surface, #fff);
          border-radius: var(--ddd-radius-lg, 12px);
          box-shadow: var(--ddd-box-shadow-md, 0 2px 8px rgba(0, 0, 0, 0.1));
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease-in-out;
        }

        .card:hover {
          transform: scale(1.01);
        }

        .header {
          display: flex;
          align-items: center;
          padding: var(--ddd-spacing-3, 12px);
          border-bottom: 1px solid var(--ddd-border-color, #e0e0e0);
        }

        .profile-pic {
          width: var(--ddd-size-xl, 48px);
          height: var(--ddd-size-xl, 48px);
          border-radius: 50%;
          background-image: url("https://assets.pokemon.com/assets/cms2/img/pokedex/full/038.png");
          background-size: cover;
          background-position: center;
          margin-right: var(--ddd-spacing-2, 8px);
        }

        .username {
          font-weight: var(--ddd-font-weight-bold, 700);
          font-size: var(--ddd-font-size-l, 18px);
          color: var(--ddd-theme-primary, #000);
        }

        .image-container img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-4, 20px);
          padding: var(--ddd-spacing-3, 12px);
          border-top: 1px solid var(--ddd-border-color, #e0e0e0);
        }

        button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 6px);
          color: var(--ddd-theme-primary, #000);
          transition: transform 0.18s ease;
          font-size: var(--ddd-font-size-m, 16px);
        }

        button:active {
          transform: scale(1.1);
        }

        simple-icon-lite {
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          color: var(--ddd-theme-primary, #000);
        }

        .likes-count {
          font-size: var(--ddd-font-size-s, 14px);
        }

        @media (max-width: 600px) {
          .card {
            max-width: 95%;
          }
        }
      `,
    ];
  }

  render() { //Our render, for some reason only social:share work, too lazy to figure it out
    // I had chatgpt fix the format for me, cause it is mad ugly with all the line in a mess.
    return html`
      ${this.gallery.map(
        (item) => html`
          <div class="card">
            <div class="header">
              <div class="profile-pic"></div>
              <div class="username">${item.username}</div>
            </div>

            <div class="image-container">
              <img src="${item.image}" alt="Fox by ${item.username}" />
            </div>

            <div class="actions">
              <button @click="${() => this.handleLike(item.id)}" title="Like">
                <simple-icon-lite icon="favorite"></simple-icon-lite>
                <span class="likes-count">${this.likes[item.id] || item.likes || 0}</span>
              </button>
              <button @click="${() => this.handleShare(item.shareLink)}" title="Share">
                <simple-icon-lite icon="social:share"></simple-icon-lite> 
              </button>
            </div>
          </div>
        `
      )}
    `;
  }
}

globalThis.customElements.define(FoxApp.tag, FoxApp);

//This too way too much unnecessary time, im dead inside.
//Still working on it, a lot of stuff to improve.