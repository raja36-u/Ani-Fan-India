import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, Pin, Heart, Share2, Flag, Clipboard, ChevronLeft, ChevronRight,
  Play, Film, User, Eye, MoreVertical, Clock3, Settings, Headphones,
  Crown, X, Gift, CheckCircle2, History, Sparkles, CalendarDays
} from "lucide-react";
import "./styles.css";

const ANIME = [
  { id: 1, title: "Solo Leveling", episode: "Episode 12", views: "12.8K", likes: 1200, date: "12/04/2026", pinned: true, category: "Top Rated",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85" },
  { id: 2, title: "Naruto Shippuden", episode: "Episode 500", views: "9.4K", likes: 892, date: "12/04/2026", pinned: true, category: "Completed",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85" },
  { id: 3, title: "Demon Slayer", episode: "Episode 26", views: "8.7K", likes: 760, date: "10/04/2026", pinned: false, category: "Completed",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85" },
  { id: 4, title: "Attack on Titan", episode: "Episode 87", views: "7.9K", likes: 721, date: "09/04/2026", pinned: false, category: "Completed",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85" },
  { id: 5, title: "Jujutsu Kaisen", episode: "Episode 24", views: "6.2K", likes: 610, date: "08/04/2026", pinned: false, category: "Top Rated",
    image: "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?auto=format&fit=crop&w=1200&q=85" },
  { id: 6, title: "One Piece", episode: "Episode 1090", views: "5.8K", likes: 560, date: "07/04/2026", pinned: false, category: "Ongoing",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85" }
];

const SEARCH_RESULTS = [
  { id: "n1", title: "Naruto Shippuden", episode: "500 Episodes", views: "9.4K", image: ANIME[1].image },
  { id: "n2", title: "Naruto (Original)", episode: "220 Episodes", views: "4.8K", image: ANIME[2].image },
  { id: "n3", title: "Boruto: Naruto Next Generations", episode: "293 Episodes", views: "3.2K", image: ANIME[1].image },
  { id: "n4", title: "Naruto Movies", episode: "12 Episodes", views: "1.1K", image: ANIME[2].image }
];

function telegram() { return window.Telegram?.WebApp || null; }

function App() {
  const [tab, setTab] = useState("playlist");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [liked, setLiked] = useState({});
  const [reported, setReported] = useState({});
  const [adStep, setAdStep] = useState(0);
  const [showAds, setShowAds] = useState(false);

  useEffect(() => {
    const tg = telegram();
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor?.("#08101c");
      tg.setBackgroundColor?.("#050711");
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ANIME.filter(a =>
      (category === "All" || a.category === category) &&
      (!q || `${a.title} ${a.episode}`.toLowerCase().includes(q))
    );
  }, [query, category]);

  const openAnime = (anime) => {
    setSelected(anime);
    setAdStep(0);
    setShowAds(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLike = (id) => setLiked(v => ({ ...v, [id]: !v[id] }));

  const shareAnime = (anime) => {
  const appUrl = "https://t.me/AniFanIndiabot/AniFanIndia";
  const text = `${anime.title} • ${anime.episode} — Ani-Fan India`;

  const shareUrl =
    `https://t.me/share/url?url=${encodeURIComponent(appUrl)}` +
    `&text=${encodeURIComponent(text)}`;

  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    window.location.href = shareUrl;
  }
};   

  const copyLink = async (anime) => {
  const episodeLink =
    `https://t.me/AniFanIndiabot/AniFanIndia?startapp=episode_${anime.id}`;

  try {
    await navigator.clipboard.writeText(episodeLink);
    alert("Episode link copied.");
  } catch {}
};

  const reportAnime = (id) => {
    setReported(v => ({ ...v, [id]: true }));
  };

  if (selected) {
    return (
      <Shell tab={tab} setTab={setTab}>
        <DetailPage
          anime={selected}
          liked={!!liked[selected.id]}
          reported={!!reported[selected.id]}
          adStep={adStep}
          showAds={showAds}
          setShowAds={setShowAds}
          setAdStep={setAdStep}
          onBack={() => setSelected(null)}
          onLike={() => toggleLike(selected.id)}
          onShare={() => shareAnime(selected)}
          onReport={() => reportAnime(selected.id)}
          onCopy={() => copyLink(selected)}
          onOpen={openAnime}
        />
      </Shell>
    );
  }

  return (
    <Shell tab={tab} setTab={setTab}>
      {tab === "playlist" && (
        <Playlist
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          filtered={filtered}
          liked={liked}
          reported={reported}
          onOpen={openAnime}
          onLike={toggleLike}
          onShare={shareAnime}
          onReport={reportAnime}
        />
      )}
      {tab === "anime" && (
        <AnimeSearchPage query={query} setQuery={setQuery} onOpen={openAnime} />
      )}
      {tab === "profile" && <Profile liked={liked} onOpen={openAnime} />}
    </Shell>
  );
}

function Shell({ children, tab, setTab }) {
  return (
    <div className="app">
      <header className="telegramBar">
        <div className="telegramBrand">
          <img src="https://raw.githubusercontent.com/raja36-u/Ani-Fan-India/main/anifanlogo.png" alt="Ani-Fan India Logo" className="brandLogo" />
          <span>Ani-Fan India</span>
        </div>
        <div className="topActions">
          <span className="chevron">⌄</span>
          <MoreVertical size={19} />
        </div>
      </header>
      <main className="content">{children}</main>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

function Playlist({ query, setQuery, category, setCategory, filtered, liked, reported, onOpen, onLike, onShare, onReport }) {
  return (
    <>
      <section className="heading">
        <h1>Anime <span>Playlist</span></h1>
        <p>Watch your favorite anime episodes here!</p>
      </section>

      <div className="searchBox">
        <Search size={19} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anime..." />
        {query && <button onClick={() => setQuery("")}><X size={18} /></button>}
      </div>

      <div className="chips">
        {["All", "Top Rated", "Ongoing", "Completed"].map(c => (
          <button key={c} className={category === c ? "chip active" : "chip"} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div className="pinCount"><Pin size={14} /> 2/2 Pinned</div>

      <div className="cards">
        {filtered.map((anime, i) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            featured={i === 0}
            liked={!!liked[anime.id]}
            reported={!!reported[anime.id]}
            onOpen={() => onOpen(anime)}
            onLike={() => onLike(anime.id)}
            onShare={() => onShare(anime)}
            onReport={() => onReport(anime.id)}
          />
        ))}
      </div>

      {!filtered.length && <div className="empty"><Sparkles size={30}/><b>No anime found</b><span>Try another title or category.</span></div>}
    </>
  );
}

function AnimeCard({ anime, featured, liked, reported, onOpen, onLike, onShare, onReport }) {
  return (
    <article className={featured ? "animeCard featured" : "animeCard"}>
      <button className="coverButton" onClick={onOpen}>
        {anime.pinned && <span className="pinnedBadge"><Pin size={11}/> PINNED</span>}
        <img src={anime.image} alt="" />
        <span className="coverGradient" />
        <span className="coverTitle">{anime.title}</span>
      </button>
      <div className="cardInfo">
        <div className="titleLine">
          <div>
            <h2 onClick={onOpen}>{anime.title}</h2>
            <p>{anime.episode}</p>
          </div>
          <span className="views"><Eye size={13}/> {anime.views}</span>
        </div>
        <div className="cardActions">
          <button className={liked ? "smallAction liked" : "smallAction"} onClick={onLike}><Heart size={15} fill={liked ? "currentColor" : "none"}/> {anime.likes + (liked ? 1 : 0)}</button>
          <button className="smallAction" onClick={onShare}><Share2 size={15}/> Share</button>
          <button className={reported ? "smallAction reported" : "smallAction"} onClick={onReport}><Flag size={14}/> {reported ? "Reported" : "Report"}</button>
        </div>
      </div>
    </article>
  );
}

function DetailPage({ anime, liked, reported, adStep, showAds, setShowAds, setAdStep, onBack, onLike, onShare, onReport, onCopy, onOpen }) {
  return (
    <>
      <button className="backLink" onClick={onBack}><ChevronLeft size={17}/> Back to Anime</button>
      <article className="detailCard">
        <div className="detailCover">
          <img src={anime.image} alt="" />
          <span className="detailPinned"><Pin size={11}/> PINNED</span>
        </div>
        <div className="detailBody">
          <h1>{anime.title}</h1>
          <div className="episodeText">{anime.episode}</div>
          <div className="detailMeta"><Eye size={15}/> {anime.views} <span>•</span><CalendarDays size={14}/> {anime.date}</div>

          <div className="cardActions detailActions">
            <button className={liked ? "smallAction liked" : "smallAction"} onClick={onLike}><Heart size={15} fill={liked ? "currentColor" : "none"}/> {anime.likes + (liked ? 1 : 0)}</button>
            <button className="smallAction" onClick={onShare}><Share2 size={15}/> Share</button>
            <button className={reported ? "smallAction reported" : "smallAction"} onClick={onReport}><Flag size={14}/> {reported ? "Reported" : "Report"}</button>
          </div>

          <button className="copyLink" onClick={onCopy}><Clipboard size={16}/> Copy Link</button>

          <button className="watchUnlock" onClick={() => setShowAds(true)}>
            <Play size={17} fill="currentColor"/> Watch Ads ({adStep}/2)
          </button>
        </div>
      </article>

      <section className="moreSection">
        <div className="sectionHeader"><h2>More Episodes</h2><span>View All</span></div>
        {[499, 498, 497].map(ep => (
          <button className="episodeRow" key={ep} onClick={() => onOpen({...anime, id: `${anime.id}-${ep}`, episode: `Episode ${ep}`})}>
            <img src={anime.image} alt="" />
            <div><b>{anime.title}</b><span>Episode {ep}</span><small><Eye size={11}/> {ep === 499 ? "12.1K" : "8.6K"}</small></div>
            <Heart size={16} className="heartGhost"/>
          </button>
        ))}
      </section>

      {showAds && (
        <div className="modalShade" onClick={() => setShowAds(false)}>
          <div className="adModal" onClick={e => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setShowAds(false)}><X size={18}/></button>
            <div className="giftCircle"><Gift size={31}/></div>
            <h2>Watch Ads to Unlock</h2>
            <p>Complete <b>2 Ads</b> to get<br/><span>Episode Link & Channel Access</span></p>
            <div className="steps">
              {[1,2].map(n => <div key={n} className={adStep >= n ? "step done" : "step"}>{adStep >= n ? <CheckCircle2 size={15}/> : n}</div>)}
            </div>
            <div className="stepText">{adStep}/2 Completed</div>
            <button className="watchAd" onClick={async () => {
  try {
    if (!window.Adsgram) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://sad.adsgram.ai/js/sad.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const AdController = window.Adsgram.init({ blockId: "46662" });
    const result = await AdController.show();

    if (result?.done) {
      setAdStep(s => Math.min(2, s + 1));
    }
  } catch (error) {
    console.log("AdsGram error:", error);
  }
}}>
              {adStep >= 2 ? "Unlocked ✓" : `▶ Watch Ad`}
            </button>
            <small>After completing 2 ads, you will get the link to watch this episode.</small>
            {adStep >= 2 && <button className="episodeOpen" onClick={() => alert("Connect this button to your Telegram channel / episode URL.")}>Open Episode Link</button>}
          </div>
        </div>
      )}
    </>
  );
}

function AnimeSearchPage({ query, setQuery, onOpen }) {
  const q = query.trim().toLowerCase();
  const results = SEARCH_RESULTS.filter(x => !q || `${x.title} ${x.episode}`.toLowerCase().includes(q));
  return (
    <>
      <button className="backLink" onClick={() => setQuery("")}><ChevronLeft size={17}/> Back to Playlist</button>
      <div className="searchBox large">
        <Search size={19}/>
        <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anime..." />
        {query && <button onClick={() => setQuery("")}><X size={18}/></button>}
      </div>
      <div className="resultsTitle">Search Results</div>
      <div className="resultList">
        {results.map(r => (
          <button key={r.id} className="resultRow" onClick={() => onOpen({...r, episode: r.episode, likes: 0, date: "12/04/2026", pinned: false, category: "All"})}>
            <img src={r.image} alt="" />
            <div><b>{r.title}</b><span>{r.episode}</span><small><Eye size={11}/> {r.views}</small></div>
            <ChevronRight size={18}/>
          </button>
        ))}
      </div>
    </>
  );
}

function Profile({ liked, onOpen }) {
  const likedAnime = ANIME.filter(a => liked[a.id]);
  return (
    <>
      <section className="profileHead">
        <div className="avatar"><img src="/logo.png" alt="Ani-Fan India"/></div>
        <div><h1>Ani-Fan India 👑</h1><p>@anifan_india</p><span className="lover"><Crown size={12}/> Anime Lover</span></div>
      </section>

      <div className="stats">
        <div><b>12</b><span>Posts</span></div><div><b>5.8K</b><span>Followers</span></div><div><b>3.2K</b><span>Following</span></div>
      </div>

      <div className="profileMenu">
        <button onClick={() => alert(likedAnime.length ? `${likedAnime.length} liked anime` : "No liked anime yet")}><Heart size={17}/> Liked Anime <ChevronRight size={17}/></button>
        <button><History size={17}/> Watched History <ChevronRight size={17}/></button>
        <button><Settings size={17}/> Settings <ChevronRight size={17}/></button>
        <button><Headphones size={17}/> Help & Support <ChevronRight size={17}/></button>
      </div>

      <section className="likedPreview">
        <div className="sectionHeader"><h2>Liked Anime</h2><span>{likedAnime.length}</span></div>
        {(likedAnime.length ? likedAnime : ANIME.slice(0,4)).map(a => (
          <button key={a.id} className="likedRow" onClick={() => onOpen(a)}>
            <img src={a.image} alt="" /><div><b>{a.title}</b><span>{a.episode}</span><small>{a.date}</small></div><Heart size={16} fill="currentColor"/>
          </button>
        ))}
      </section>
    </>
  );
}

function BottomNav({ tab, setTab }) {
  return (
    <nav className="bottomNav">
      <button className={tab === "playlist" ? "active" : ""} onClick={() => setTab("playlist")}><Film/><span>Playlist</span></button>
      <button className={tab === "anime" ? "active" : ""} onClick={() => setTab("anime")}><Film/><span>Anime</span></button>
      <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}><User/><span>Profile</span></button>
    </nav>
  );
}

createRoot(document.getElementById("root")).render(<App />);
