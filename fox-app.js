/**
 * Copyright 2025 
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js"; 
import "@haxtheweb/simple-icon/lib/simple-icons.js";

/**
 * `fox-app`
 */
export class FoxApp extends DDDSuper(I18NMixin(LitElement)) {
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

    //Spend way too much time for it to not work, so i have chatgpt add lazy loading for me
    this.imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            this.imageObserver.unobserve(img);
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadGallery();
    this.loadLikes();
  }
//I spend 3 hour on this just to realize it is call fox-picGalley.json instead of fox-picGallery.json
//Needless to say I hate myself but it is funny so i keep galley.
  async loadGallery() {
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
//Our like system like last verison
  loadLikes() {
    const saved = localStorage.getItem("foxGalleryLikes");
    if (saved) {
      this.likes = JSON.parse(saved);
    }
  }

  saveLikes() {
    localStorage.setItem("foxGalleryLikes", JSON.stringify(this.likes));
  }

  handleLike(id) {
    this.likes[id] = (this.likes[id] || 0) + 1;
    this.saveLikes();
    this.requestUpdate();
  }

  async handleShare(url) {
    if (navigator.share) {
      try {
        await navigator.share({
          text: "Look at this fox I found working on this project",
          url,
        });
      } catch (err) {
        console.warn("Share canceled or failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }
//Smaller card design
  static get styles() {
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
          max-width: 280px;
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
          overflow: hidden;
          margin-right: var(--ddd-spacing-2, 8px);
          flex-shrink: 0;
        }

        .profile-pic img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
//Small name
        .username {
          font-weight: var(--ddd-font-weight-bold, 700);
          font-size: var(--ddd-font-size-m, 14px);
          color: var(--ddd-theme-primary, #000);
        }

        .image-container {
          width: 100%;
          height: 220px;
          overflow: hidden;
          background: #eee;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
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
            max-width: 46%;
          }
        }
      `,
    ];
  }
//More lazzy loading stuff?
  updated() {
    const lazyImages = this.renderRoot.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => this.imageObserver.observe(img));
  }
//Our render
  render() {
    return html`
      ${this.gallery.map(
        (item) => html`
          <div class="card">
            <div class="header">
              <div class="profile-pic">
                <img src="${item.profilePic}" alt="${item.username} profile picture">
              </div>

              <div class="username">${item.username}</div>
            </div>

            <div class="image-container">
              <img 
                data-src="${item.image}" 
                src=""  
                alt="Fox by ${item.username}" 
              />
            </div>

            <div class="actions">
              <button @click="${() => this.handleLike(item.id)}" title="Like">
                <simple-icon-lite icon="favorite"></simple-icon-lite>
                <span class="likes-count">
                  ${this.likes[item.id] || item.likes || 0}
                </span>
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


//Stuff to change
//1. Smaller card - done
//2. Picture need to be the same size - done
//3. The card need to load as it is rolling down - done
//4.  Aka when you open a website it won't load all the picture at once, which save memory
// Loading = "lazy", fetchpriority = "low" - done
//5. No hard coded pokemon, instead put the profile picture into the json files, so each user have unique profile. - done
// Total usage 5 hours, I understand why Cs major are bald.