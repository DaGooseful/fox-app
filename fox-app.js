/**
 * Copyright 2025 
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `fox-app`
 * DDD-styled Instagram-like fox photo card
 */
export class FoxApp extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "fox-app";
  }

  static get properties() {
    return {
      ...super.properties,
      imageUrl: { type: String },
      likes: { type: Number },
    };
  }

  constructor() {
    super();
    this.imageUrl = "";
    this.likes = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.getFoxImage();
    this.loadLikes();
  }

  async getFoxImage() {
    try {
      const res = await fetch("https://randomfox.ca/floof/");
      const data = await res.json();
      this.imageUrl = data.image;
    } catch (err) {
      console.error("Error fetching fox:", err);
    }
  }

  loadLikes() {
    const savedLikes = localStorage.getItem("foxLikes");
    if (savedLikes) {
      this.likes = parseInt(savedLikes, 10);
    }
  }

  saveLikes() {
    localStorage.setItem("foxLikes", this.likes);
  }

  handleLike() {
    this.likes++;
    this.saveLikes();
    this.requestUpdate();
  }

  async handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this fox!",
          text: "Look at this random fox 🦊",
          url: this.imageUrl,
        });
      } catch (err) {
        console.warn("Share canceled or failed:", err);
      }
    } else {
      navigator.clipboard.writeText(this.imageUrl);
      alert("Fox image link copied to clipboard!");
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background-color: var(--ddd-theme-background, #f9f9f9);
          min-height: 100vh;
          font-family: var(--ddd-font-navigation, "Helvetica Neue", Arial, sans-serif);
          color: var(--ddd-theme-primary, #000);
          padding: var(--ddd-spacing-4, 16px);
          box-sizing: border-box;
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
          transition: var(--ddd-transition, all 0.2s ease-in-out);
        }

        .header {
          display: flex;
          align-items: center;
          padding: var(--ddd-spacing-2, 10px) var(--ddd-spacing-3, 12px);
          border-bottom: 1px solid var(--ddd-border-color, #e0e0e0);
          justify-content: flex-start;
          flex-shrink: 0;
        }

        .profile-pic {
          width: var(--ddd-size-xl, 48px);
          height: var(--ddd-size-xl, 48px);
          border-radius: var(--ddd-radius-full, 50%);
          background-image: url("https://assets.pokemon.com/assets/cms2/img/pokedex/full/038.png");
          background-size: cover;
          background-position: center;
          margin-right: var(--ddd-spacing-2, 10px);
          flex-shrink: 0;
        }

        .username {
          font-weight: var(--ddd-font-weight-bold, 700);
          font-size: var(--ddd-font-size-xl, 20px);
          color: var(--ddd-theme-primary, #000);
          line-height: 1.2;
          letter-spacing: var(--ddd-letter-spacing-tight, 0);
        }

        .image-container {
          width: 100%;
          display: flex;
          justify-content: center;
          background-color: var(--ddd-theme-surface, #fff);
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
          flex-shrink: 0;
        }

        .actions button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: var(--ddd-font-size-l, 22px);
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 6px);
          color: var(--ddd-theme-primary, #000);
          transition: var(--ddd-transition-transform, transform 0.18s ease);
        }

        .actions button:active {
          transform: scale(1.12);
        }

        .likes-count {
          font-size: var(--ddd-font-size-s, 14px);
        }

        /* 📱 Mobile responsiveness */
        @media (max-width: 600px) {
          :host {
            padding: var(--ddd-spacing-2, 10px);
          }

          .card {
            max-width: 95%;
            border-radius: var(--ddd-radius-md, 10px);
          }

          .profile-pic {
            width: var(--ddd-size-l, 40px);
            height: var(--ddd-size-l, 40px);
          }

          .username {
            font-size: var(--ddd-font-size-l, 18px);
          }

          .actions {
            gap: var(--ddd-spacing-3, 16px);
          }

          .actions button {
            font-size: var(--ddd-font-size-l, 20px);
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="card">
        <div class="header">
          <div class="profile-pic" role="img" aria-label="profile"></div>
          <div class="username">TheNinetales</div>
        </div>

        <div class="image-container">
          ${this.imageUrl
            ? html`<img src="${this.imageUrl}" alt="Random Fox" />`
            : html`<p>Loading...</p>`}
        </div>

        <div class="actions">
          <button @click="${this.handleLike}" title="Like" aria-label="like">
            ❤️ <span class="likes-count">${this.likes}</span>
          </button>
          <button @click="${this.handleShare}" title="Share" aria-label="share">🔗</button>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(FoxApp.tag, FoxApp);