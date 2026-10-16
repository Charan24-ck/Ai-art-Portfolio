
import { useMemo, useRef, useState } from "react";
import "./App.css";

const initialArt = [
  {
    id: 1,
    title: "Cosmic Dreams",
    category: "Fantasy",
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=85",
    prompt: "A surreal cosmic universe with glowing galaxies",
  },
  {
    id: 2,
    title: "Neon Samurai",
    category: "Cyberpunk",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
    prompt: "A futuristic neon world with cinematic lighting",
  },
  {
    id: 3,
    title: "Dream Portrait",
    category: "Portrait",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
    prompt: "An expressive portrait with artistic lighting",
  },
  {
    id: 4,
    title: "Liquid Universe",
    category: "Abstract",
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=85",
    prompt: "Colorful flowing abstract shapes and textures",
  },
  {
    id: 5,
    title: "Golden Horizon",
    category: "Fantasy",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85",
    prompt: "A cinematic golden landscape in a dream world",
  },
  {
    id: 6,
    title: "Future Worlds",
    category: "Cyberpunk",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=85",
    prompt: "An imaginative futuristic world inspired by nature",
  },
];

const categories = [
  "All",
  "Fantasy",
  "Cyberpunk",
  "Portrait",
  "Abstract",
  "My Uploads",
];

function App() {
  const [page, setPage] = useState("Explore");
  const [artworks, setArtworks] = useState(initialArt);
  const [favorites, setFavorites] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Anime");
  const [ratio, setRatio] = useState("1:1");
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const fileRef = useRef(null);

  const filteredArt = useMemo(() => {
    return artworks.filter((art) => {
      const matchesCategory =
        category === "All"
          ? true
          : category === "My Uploads"
            ? art.uploaded === true
            : art.category === category;

      const matchesSearch =
        `${art.title} ${art.category} ${art.prompt || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesPage =
        page !== "Favorites" || favorites.includes(art.id);

      return matchesCategory && matchesSearch && matchesPage;
    });
  }, [artworks, category, search, page, favorites]);

  function navigate(destination) {
    setPage(destination);
    setMobileMenu(false);
    setNotice("");
    if (destination === "Favorites") {
      setCategory("All");
    } else if (destination === "Studio") {
      setCategory("All");
    } else {
      setCategory("All");
      setSearch("");
    }
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function uploadArtwork(event) {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) =>
      ["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
        file.type
      )
    );

    if (!validFiles.length) {
      setNotice("Choose a PNG, JPG, WEBP, or GIF image.");
      return;
    }

    const newArt = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^.]+$/, ""),
      category: "My Uploads",
      image: URL.createObjectURL(file),
      prompt: "Uploaded artwork",
      uploaded: true,
    }));

    setArtworks((current) => [...newArt, ...current]);
    setCategory("My Uploads");
    setPage("Explore");
    setNotice(`${newArt.length} artwork(s) added to your gallery.`);
    event.target.value = "";
  }

  function createDemoArt() {
    if (!prompt.trim()) {
      setNotice("Enter a creative prompt first.");
      return;
    }

    // Frontend demonstration only. A real AI image API
    // must be connected to generate a new image.
    const demoImages = initialArt.filter(
      (art) => art.category !== "Portrait"
    );
    const image =
      demoImages[Math.floor(Math.random() * demoImages.length)];

    const generated = {
      id: crypto.randomUUID(),
      title: prompt.trim().slice(0, 42),
      category: "My Uploads",
      image: image.image,
      prompt: `${prompt.trim()} | Style: ${style} | Ratio: ${ratio}`,
      uploaded: true,
    };

    setArtworks((current) => [generated, ...current]);
    setCategory("All");
    setPage("Explore");
    setNotice(
      "Demo artwork added. Connect an AI image API to generate original images."
    );
    setPrompt("");
  }

  function downloadArt(art) {
    const link = document.createElement("a");
    link.href = art.image;
    link.download = `${art.title.replace(/[^a-z0-9-_]/gi, "-")}.jpg`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }

  return (
    <div className="studio-app">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <a href="#home" className="brand" onClick={() => navigate("Explore")}>
          <span className="brand-mark">✳</span>
          <span>
            neural<span className="brand-light">canvas</span>
            <small>CREATIVE STUDIO</small>
          </span>
        </a>

        <div className="side-label">WORKSPACE</div>

        {[
          ["Explore", "⌘"],
          ["Studio", "✧"],
          ["Favorites", "♡"],
        ].map(([name, icon]) => (
          <button
            key={name}
            className={`side-link ${page === name ? "side-active" : ""}`}
            onClick={() => navigate(name)}
          >
            <span className="side-icon">{icon}</span>
            {name}
            {name === "Favorites" && favorites.length > 0 && (
              <span className="side-count">{favorites.length}</span>
            )}
          </button>
        ))}

        <div className="side-label collection-label">COLLECTION</div>

        <button
          className={`side-link ${category === "My Uploads" ? "side-active" : ""}`}
          onClick={() => {
            setPage("Explore");
            setCategory("My Uploads");
            setSearch("");
            setMobileMenu(false);
          }}
        >
          <span className="side-icon">▧</span>
          My uploads
        </button>

        <div className="sidebar-bottom">
          <div className="pro-card">
            <span className="pro-icon">✦</span>
            <strong>Ideas have no limits.</strong>
            <p>Your next masterpiece starts with an idea.</p>
            <button onClick={() => navigate("Studio")}>
              Open AI Studio ↗
            </button>
          </div>
          <div className="profile">
            <div className="avatar">NC</div>
            <div>
              <strong>Creative Explorer</strong>
              <span>Free workspace</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{page}</strong>
          </div>
          <div className="topbar-right">
            <span className="status-dot" />
            <span className="online-label">Creative mode</span>
            <button
              className="upload-button"
              onClick={() => fileRef.current?.click()}
            >
              + Upload art
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              hidden
              onChange={uploadArtwork}
            />
          </div>
        </header>

        <div className="page-content">
          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button onClick={() => setNotice("")}>×</button>
            </div>
          )}

          {page === "Studio" ? (
            <section className="studio-page">
              <div className="eyebrow">✦ YOUR CREATIVE PLAYGROUND</div>
              <h1>Create something <span>extraordinary.</span></h1>
              <p className="page-description">
                Turn the pictures in your imagination into a creative
                direction for your next masterpiece.
              </p>

              <div className="generator-layout">
                <div className="generator-panel">
                  <label htmlFor="prompt">Describe your imagination</label>
                  <textarea
                    id="prompt"
                    rows={5}
                    maxLength={1000}
                    placeholder="A futuristic anime hero standing in a neon city, cinematic lighting, intricate details..."
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                  />
                  <div className="prompt-footer">
                    <span>{prompt.length}/1000 characters</span>
                    <button
                      className="text-button"
                      onClick={() =>
                        setPrompt(
                          "A mysterious anime hero in a futuristic neon city, cinematic lighting, intricate details, dramatic atmosphere"
                        )
                      }
                    >
                      ✧ Try a prompt
                    </button>
                  </div>

                  <label htmlFor="art-style">Art style</label>
                  <select
                    id="art-style"
                    value={style}
                    onChange={(event) => setStyle(event.target.value)}
                  >
                    <option>Anime</option>
                    <option>Photorealistic</option>
                    <option>Cyberpunk</option>
                    <option>Fantasy</option>
                    <option>Digital painting</option>
                    <option>3D render</option>
                    <option>Abstract</option>
                  </select>

                  <label>Aspect ratio</label>
                  <div className="ratio-options">
                    {["1:1", "3:4", "16:9"].map((item) => (
                      <button
                        key={item}
                        className={ratio === item ? "ratio-active" : ""}
                        onClick={() => setRatio(item)}
                      >
                        <span>
                          {item === "1:1"
                            ? "□"
                            : item === "3:4"
                              ? "▯"
                              : "▱"}
                        </span>
                        {item}
                      </button>
                    ))}
                  </div>

                  <button
                    className="generate-button"
                    onClick={createDemoArt}
                  >
                    ✦ Generate artwork <span>↗</span>
                  </button>
                  <p className="demo-note">
                    Frontend demo · No AI generation API connected
                  </p>
                </div>

                <div className="studio-preview">
                  <div className="preview-header">
                    <span>CREATIVE CANVAS</span>
                    <span className="preview-status">● Preview</span>
                  </div>
                  <div className="preview-art">
                    <img
                      src={
                        selected?.image ||
                        initialArt[0].image
                      }
                      alt="Creative canvas preview"
                    />
                    <div className="preview-overlay">
                      <span>✳</span>
                      <h2>Your imagination.</h2>
                      <p>Your next creation starts here.</p>
                    </div>
                  </div>
                  <p className="preview-caption">
                    Add a prompt and explore different artistic directions.
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <>
              <section className="welcome-banner">
                <div className="welcome-copy">
                  <div className="eyebrow">✦ THE NEXT ERA OF CREATIVITY</div>
                  <h1>
                    Art beyond
                    <br />
                    <span>the ordinary.</span>
                  </h1>
                  <p>
                    Explore new dimensions of imagination. Discover
                    visual worlds, collect inspiration, and create freely.
                  </p>
                  <div className="welcome-actions">
                    <button
                      className="generate-button"
                      onClick={() => navigate("Studio")}
                    >
                      ✧ Enter AI Studio
                    </button>
                    <button
                      className="outline-button"
                      onClick={() =>
                        document
                          .getElementById("art-gallery")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Browse collection ↓
                    </button>
                  </div>
                </div>

                <div className="banner-art">
                  <img
                    src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1100&q=90"
                    alt="Cosmic artistic universe"
                  />
                  <div className="banner-art-label">
                    <span>✦ FEATURED INSPIRATION</span>
                    <strong>Beyond the Universe</strong>
                    <small>Digital art · Cosmic fantasy</small>
                  </div>
                </div>
                <div className="banner-glow" />
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <span>Total artworks</span>
                  <strong>{artworks.length.toString().padStart(2, "0")}</strong>
                  <small>✦ In your gallery</small>
                </div>
                <div className="stat-card">
                  <span>Favorites</span>
                  <strong>{favorites.length.toString().padStart(2, "0")}</strong>
                  <small>♡ Your collection</small>
                </div>
                <div className="stat-card">
                  <span>Art categories</span>
                  <strong>
                    {new Set(artworks.map((art) => art.category)).size
                      .toString()
                      .padStart(2, "0")}
                  </strong>
                  <small>✧ Explore styles</small>
                </div>
              </section>

              <section className="gallery-area" id="art-gallery">
                <div className="gallery-heading">
                  <div>
                    <div className="eyebrow">YOUR VISUAL UNIVERSE</div>
                    <h2>
                      {page === "Favorites"
                        ? "Your favorites."
                        : "Explore artwork."}
                    </h2>
                    <p>Every image opens a new world of possibilities.</p>
                  </div>
                  <span className="result-count">
                    {filteredArt.length} ARTWORKS
                  </span>
                </div>

                <div className="gallery-controls">
                  <div className="category-list">
                    {categories.map((item) => (
                      <button
                        key={item}
                        className={category === item ? "chip chip-active" : "chip"}
                        onClick={() => setCategory(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <input
                    className="art-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="⌕ Search artwork..."
                    aria-label="Search artwork"
                  />
                </div>

                {filteredArt.length > 0 ? (
                  <div className="advanced-grid">
                    {filteredArt.map((art, index) => (
                      <article
                        className={`advanced-card card-${index % 3}`}
                        key={art.id}
                      >
                        <button
                          className="art-open"
                          onClick={() => setSelected(art)}
                          aria-label={`Open ${art.title}`}
                        >
                          <img src={art.image} alt={art.title} loading="lazy" />
                          <span className="art-type">{art.category}</span>
                          <span className="art-view">View details ↗</span>
                        </button>
                        <div className="advanced-card-info">
                          <div>
                            <h3>{art.title}</h3>
                            <p>
                              {art.uploaded ? "Your creation" : "Curated inspiration"}
                            </p>
                          </div>
                          <button
                            className={`heart-button ${
                              favorites.includes(art.id) ? "heart-active" : ""
                            }`}
                            onClick={() => toggleFavorite(art.id)}
                            aria-label={
                              favorites.includes(art.id)
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            {favorites.includes(art.id) ? "♥" : "♡"}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <span>✧</span>
                    <h3>No artworks found</h3>
                    <p>Try another search, category, or upload an image.</p>
                    <button
                      className="outline-button"
                      onClick={() => {
                        setCategory("All");
                        setSearch("");
                        if (page === "Favorites") setPage("Explore");
                      }}
                    >
                      Reset gallery
                    </button>
                  </div>
                )}
              </section>
            </>
          )}

          <footer className="app-footer">
            <a href="#home" className="brand footer-brand">
              <span className="brand-mark">✳</span> NeuralCanvas
            </a>
            <span>Where imagination becomes visual.</span>
            <span>© 2026 NeuralCanvas Studio</span>
          </footer>
        </div>
      </main>

      {selected && (
        <div
          className="detail-backdrop"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <div
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="detail-close"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              ×
            </button>
            <img src={selected.image} alt={selected.title} />
            <div className="detail-content">
              <span className="eyebrow">{selected.category}</span>
              <h2>{selected.title}</h2>
              <p>{selected.prompt}</p>
              <div className="detail-actions">
                <button
                  className="generate-button"
                  onClick={() => downloadArt(selected)}
                >
                  ↓ Download
                </button>
                <button
                  className="outline-button"
                  onClick={() => toggleFavorite(selected.id)}
                >
                  {favorites.includes(selected.id)
                    ? "♥ Favorited"
                    : "♡ Add to favorites"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
