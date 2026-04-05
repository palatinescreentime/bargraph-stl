import { useState, useMemo, useEffect } from "react";

const W = 720, H = 560;
const PAD = { left: 80, right: 80, top: 38, bottom: 38 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;
const CX = PAD.left + CW / 2;
const CY = PAD.top  + CH / 2;
const RANGE = 5.4;

function toSvgX(x) { return CX + (x / RANGE) * (CW / 2); }
function toSvgY(y) { return CY - (y / RANGE) * (CH / 2); }

const MIN_PRICE = 4, MAX_PRICE = 14, MIN_R = 5, MAX_R = 14;
function radius(p) {
  return MIN_R + Math.min(1, Math.max(0, (p - MIN_PRICE) / (MAX_PRICE - MIN_PRICE))) * (MAX_R - MIN_R);
}

function labelAnchor(x) { return x > 2.5 ? "end" : "start"; }
function labelDx(x, r)  { return x > 2.5 ? -(r + 6) : r + 6; }

const PRICE_TIERS = [
  { id: "budget", min: 0,  max: 7,  rep: 5,  sub: "$4–7"  },
  { id: "mid",    min: 8,  max: 11, rep: 9,  sub: "$8–11" },
  { id: "pricey", min: 12, max: 99, rep: 13, sub: "$12+"  },
];

const FONT = "'Inter','Helvetica Neue',Arial,sans-serif";

const DARK = {
  bg: "#000", grid: "#181818", box: "#282828", axis: "#3a3a3a",
  axisLabel: "#555", quadLabel: "rgba(255,255,255,0.18)",
  dimDot: "#2a2a2a", label: "#bbb", tooltip: "#111",
  ttBorder: "66", ttText: "#aaa", ttSub: "#3a3a3a",
  filterBrd: "#2a2a2a", filterTxt: "#555",
  legendTxt: "#444", countTxt: "#3a3a3a", titleColor: "#fff",
  sheetBg: "#111", sheetBorder: "#2a2a2a",
};
const LIGHT = {
  bg: "#f8f6f1", grid: "#e5e2da", box: "#d8d4cc", axis: "#aaa89f",
  axisLabel: "#888", quadLabel: "rgba(0,0,0,0.18)",
  dimDot: "#d0ccc4", label: "#444", tooltip: "#fff",
  ttBorder: "aa", ttText: "#555", ttSub: "#bbb",
  filterBrd: "#ccc", filterTxt: "#888",
  legendTxt: "#888", countTxt: "#ccc", titleColor: "#111",
  sheetBg: "#fff", sheetBorder: "#ddd",
};

export default function BarGraph({ city, bars: ALL_BARS, categories: CATEGORIES }) {
  const [selected, setSelected]           = useState(null); // touch-selected bar
  const [hovered, setHovered]             = useState(null); // mouse-hovered bar
  const [activeTypes, setActiveTypes]     = useState(new Set());
  const [activeTiers, setActiveTiers]     = useState(new Set());
  const [dark, setDark]                   = useState(true);
  const [isMobile, setIsMobile]           = useState(false);

  const T = dark ? DARK : LIGHT;
  const allCats = Object.keys(CATEGORIES);
  const anyFilterOn = activeTypes.size > 0 || activeTiers.size > 0;
  const tooltipBar = hovered || selected;

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function toggleType(cat) {
    setActiveTypes(prev => { const n = new Set(prev); n.has(cat) ? n.delete(cat) : n.add(cat); return n; });
  }
  function toggleTier(id) {
    setActiveTiers(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function clearAll() { setActiveTypes(new Set()); setActiveTiers(new Set()); }

  function barVisible(b) {
    const catOk   = activeTypes.size === 0 || activeTypes.has(b.cat);
    const priceOk = activeTiers.size === 0  || PRICE_TIERS.some(t => activeTiers.has(t.id) && b.price >= t.min && b.price <= t.max);
    return catOk && priceOk;
  }

  const visibleBars = useMemo(() => ALL_BARS.filter(barVisible), [activeTypes, activeTiers, ALL_BARS]);
  const dimmedBars  = useMemo(() => anyFilterOn ? ALL_BARS.filter(b => !barVisible(b)) : [], [activeTypes, activeTiers, ALL_BARS]);

  function handleBubbleClick(bar) {
    if (isMobile) setSelected(s => s?.name === bar.name ? null : bar);
  }

  return (
    <div
      onClick={e => { if (isMobile && !e.target.closest(".bubble")) setSelected(null); }}
      style={{
        background: T.bg, minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-start",
        padding: isMobile ? "16px 8px 120px" : "24px 12px",
        fontFamily: FONT, transition: "background 0.3s ease",
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes popIn  { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp{ from{transform:translateY(100%)} to{transform:translateY(0)} }
        .bubble     { cursor: pointer; }
        .bubble-pop { animation: popIn 0.38s cubic-bezier(0.34,1.56,0.64,1) both; }
        .fade-up    { animation: fadeUp 0.45s ease both; }
        .filter-row {
          display: flex; align-items: center; gap: 6px;
          flex-wrap: wrap; padding-bottom: 4px;
        }
        @media (max-width: 640px) {
          .filter-row {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .filter-row::-webkit-scrollbar { display: none; }
        }
        .filter-btn {
          border-radius: 20px; padding: 5px 12px; font-size: 11px;
          font-family: inherit; cursor: pointer; transition: all 0.15s ease;
          background: transparent; letter-spacing: 0.03em; white-space: nowrap;
          flex-shrink: 0;
        }
        .filter-btn.active { color: #000 !important; border-color: transparent; font-weight: 600; }
        .mode-btn {
          background: transparent; border: 1px solid; border-radius: 20px;
          padding: 4px 12px; font-size: 11px; font-family: inherit;
          cursor: pointer; transition: all 0.2s ease; letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .price-tier { cursor: pointer; display:flex; flex-direction:column; align-items:center; gap:3px; flex-shrink:0; }
        /* Bottom sheet on mobile */
        .bottom-sheet {
          position: fixed; bottom: 0; left: 0; right: 0;
          border-radius: 16px 16px 0 0;
          padding: 16px;
          z-index: 100;
          animation: slideUp 0.22s ease both;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.4);
        }
        /* Desktop tooltip */
        .tooltip {
          position: absolute;
          border-radius: 7px; padding: 10px 14px;
          pointer-events: none; z-index: 20; min-width: 170px;
          animation: fadeUp 0.1s ease both;
        }
      `}</style>

      {/* TITLE */}
      <div className="fade-up" style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6, flexWrap:"wrap", justifyContent:"center" }}>
        <div style={{ fontFamily:"'Impact','Arial Black',sans-serif", fontSize:"clamp(28px,7vw,56px)", letterSpacing:"0.06em", color:T.titleColor, transition:"color 0.3s" }}>
          THE <span style={{ color:"#4ab8e8" }}>BAR</span> GRAPH
        </div>
        <button className="mode-btn" onClick={() => setDark(d => !d)}
          style={{ borderColor: dark?"#444":"#bbb", color: dark?"#888":"#666" }}>
          {dark ? "☀" : "☾"}
        </button>
      </div>
      <div style={{ color:T.countTxt, fontSize:"10px", letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:10, transition:"color 0.3s" }}>
        {city.name}, {city.state} · {ALL_BARS.length} spots
      </div>

      {/* CHART CONTAINER — full width, SVG scales via viewBox */}
      <div style={{ position:"relative", width:"100%", maxWidth:W }}>

        {/* Desktop tooltip only */}
        {!isMobile && tooltipBar && (() => {
          const sx = toSvgX(tooltipBar.x), sy = toSvgY(tooltipBar.y);
          const r  = radius(tooltipBar.price);
          const gc = CATEGORIES[tooltipBar.cat].color;
          // Calculate tooltip position as % of container width
          const containerW = Math.min(window.innerWidth - 16, W);
          const scaleX = containerW / W;
          const scaledSx = sx * scaleX;
          const left = scaledSx > containerW * 0.6 ? scaledSx - r - 190 : scaledSx + r + 14;
          const top  = Math.max(0, sy * (containerW / W) - 52);
          return (
            <div className="tooltip" style={{
              left, top,
              background: T.tooltip,
              border: `1px solid ${gc}${T.ttBorder}`,
              boxShadow: `0 6px 24px rgba(0,0,0,${dark?0.85:0.15})`,
              transition: "background 0.3s",
            }}>
              <div style={{ color:gc, fontWeight:600, fontSize:13, marginBottom:5 }}>{tooltipBar.name}</div>
              <div style={{ color:T.ttText, fontSize:11, lineHeight:1.9 }}>
                <div>🏷 {tooltipBar.cat}</div>
                <div>💰 ~${tooltipBar.price} avg drink</div>
                <div style={{ color:T.ttSub, fontSize:9, marginTop:3 }}>{tooltipBar.address}</div>
              </div>
            </div>
          );
        })()}

        {/* SVG — viewBox makes it scale to any container width */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display:"block", overflow:"visible" }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Grid */}
          {[-4,-3,-2,-1,1,2,3,4].map(v => (
            <g key={v}>
              <line x1={toSvgX(v)} y1={PAD.top} x2={toSvgX(v)} y2={PAD.top+CH} stroke={T.grid} strokeWidth={1}/>
              <line x1={PAD.left} y1={toSvgY(v)} x2={PAD.left+CW} y2={toSvgY(v)} stroke={T.grid} strokeWidth={1}/>
            </g>
          ))}
          <rect x={PAD.left} y={PAD.top} width={CW} height={CH} fill="none" stroke={T.box} strokeWidth={1}/>

          {/* Axes */}
          <line x1={PAD.left} y1={CY} x2={PAD.left+CW} y2={CY} stroke={T.axis} strokeWidth={1.5}/>
          <line x1={CX} y1={PAD.top} x2={CX} y2={PAD.top+CH} stroke={T.axis} strokeWidth={1.5}/>
          <polygon points={`${CX},${PAD.top-7} ${CX-5},${PAD.top+6} ${CX+5},${PAD.top+6}`} fill={T.axis}/>
          <polygon points={`${CX},${PAD.top+CH+7} ${CX-5},${PAD.top+CH-6} ${CX+5},${PAD.top+CH-6}`} fill={T.axis}/>
          <polygon points={`${PAD.left-7},${CY} ${PAD.left+6},${CY-5} ${PAD.left+6},${CY+5}`} fill={T.axis}/>
          <polygon points={`${PAD.left+CW+7},${CY} ${PAD.left+CW-6},${CY-5} ${PAD.left+CW-6},${CY+5}`} fill={T.axis}/>

          {/* Axis labels */}
          <text x={PAD.left-10} y={CY+4} textAnchor="end" fill={T.axisLabel} fontSize={11} fontFamily={FONT} letterSpacing="0.25em" fontWeight="600">DIVE</text>
          <text x={PAD.left+CW+10} y={CY+4} textAnchor="start" fill={T.axisLabel} fontSize={11} fontFamily={FONT} letterSpacing="0.25em" fontWeight="600">CLASSY</text>
          <text x={CX} y={PAD.top-18} textAnchor="middle" fill={T.axisLabel} fontSize={11} fontFamily={FONT} letterSpacing="0.22em" fontWeight="600">DESTINATION DINING</text>
          <text x={CX} y={PAD.top+CH+22} textAnchor="middle" fill={T.axisLabel} fontSize={11} fontFamily={FONT} letterSpacing="0.25em" fontWeight="600">JUST DRINKS</text>

          {/* Quadrant ghost labels */}
          <text x={toSvgX(4.6)} y={toSvgY(4.6)} textAnchor="end" fill={T.quadLabel} fontSize={11} fontStyle="italic">Classy &amp; delicious</text>
          <text x={toSvgX(-4.6)} y={toSvgY(4.6)} textAnchor="start" fill={T.quadLabel} fontSize={11} fontStyle="italic">Hidden gem eats</text>
          <text x={toSvgX(4.6)} y={toSvgY(-4.6)} textAnchor="end" fill={T.quadLabel} fontSize={11} fontStyle="italic">Swanky scene</text>
          <text x={toSvgX(-4.6)} y={toSvgY(-4.6)} textAnchor="start" fill={T.quadLabel} fontSize={11} fontStyle="italic">Classic dive</text>

          {/* Dimmed dots */}
          {dimmedBars.map(bar => (
            <circle key={"dim-"+bar.name}
              cx={toSvgX(bar.x)} cy={toSvgY(bar.y)} r={radius(bar.price)}
              fill={T.dimDot} opacity={0.55}/>
          ))}

          {/* Active bubbles */}
          {visibleBars.map((bar, i) => {
            const sx   = toSvgX(bar.x), sy = toSvgY(bar.y), r = radius(bar.price);
            const col  = CATEGORIES[bar.cat].color;
            const isH  = (hovered?.name === bar.name) || (selected?.name === bar.name);
            const showLabel = anyFilterOn || isH;
            return (
              <g key={bar.name}
                className="bubble bubble-pop"
                style={{ transformOrigin:`${sx}px ${sy}px`, animationDelay:`${i*0.032}s` }}
                onMouseEnter={() => !isMobile && setHovered(bar)}
                onMouseLeave={() => !isMobile && setHovered(null)}
                onClick={() => handleBubbleClick(bar)}
              >
                {isH && <circle cx={sx} cy={sy} r={r+14} fill={col} opacity={0.13} filter="url(#glow)"/>}
                <circle cx={sx} cy={sy} r={isH ? r+1 : r} fill={col} opacity={isH?1:0.85} style={{ transition:"all 0.15s" }}/>
                <circle cx={sx-r*0.3} cy={sy-r*0.3} r={r*0.27} fill="white" opacity={dark?0.22:0.35}/>
                {showLabel && (
                  <text x={sx+labelDx(bar.x,r)} y={sy+4}
                    textAnchor={labelAnchor(bar.x)}
                    fill={isH ? col : T.label}
                    fontSize={10} fontFamily={FONT} fontWeight={isH?"600":"400"}
                    style={{ transition:"fill 0.15s", pointerEvents:"none" }}>
                    {bar.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* FILTERS — horizontal scroll on mobile */}
        <div style={{ marginTop:10, padding: isMobile ? "0 4px" : `0 ${PAD.left}px` }}>

          {/* Category filter row */}
          <div className="filter-row" style={{ marginBottom:10 }}>
            <span style={{ color:T.legendTxt, fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", flexShrink:0, transition:"color 0.3s" }}>Filter:</span>
            <button
              className={`filter-btn ${!anyFilterOn?"active":""}`}
              style={{
                border:`1px solid ${!anyFilterOn?"transparent":T.filterBrd}`,
                color: !anyFilterOn ? "#000" : T.filterTxt,
                background: !anyFilterOn ? "#fff" : "transparent",
              }}
              onClick={clearAll}
            >All ({ALL_BARS.length})</button>
            {allCats.map(cat => {
              const count  = ALL_BARS.filter(b => b.cat === cat).length;
              const active = activeTypes.has(cat);
              const col    = CATEGORIES[cat].color;
              return (
                <button key={cat}
                  className={`filter-btn ${active?"active":""}`}
                  style={{
                    border:`1px solid ${active ? col : T.filterBrd}`,
                    color: active ? "#000" : T.filterTxt,
                    background: active ? col : "transparent",
                  }}
                  onClick={() => toggleType(cat)}
                >{cat} ({count})</button>
              );
            })}
          </div>

          {/* Price tier circles */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:14 }}>
            <span style={{ color:T.legendTxt, fontSize:10, paddingBottom:6, transition:"color 0.3s", whiteSpace:"nowrap" }}>Avg drink:</span>
            {PRICE_TIERS.map(tier => {
              const r      = radius(tier.rep);
              const active = activeTiers.has(tier.id);
              const size   = (MAX_R + 10) * 2;
              return (
                <div key={tier.id} className="price-tier" onClick={() => toggleTier(tier.id)}>
                  <svg width={size} height={size} style={{ display:"block" }}>
                    {active && <circle cx={size/2} cy={size/2} r={r+5} fill="none" stroke="#4ab8e8" strokeWidth={1.5} opacity={0.6}/>}
                    <circle cx={size/2} cy={size/2} r={r}
                      fill={active ? "#4ab8e8" : (dark?"#fff":"#888")}
                      opacity={active ? 1 : (dark?0.28:0.35)}
                      style={{ transition:"all 0.15s" }}/>
                  </svg>
                  <span style={{ color: active ? "#4ab8e8" : T.legendTxt, fontSize:9, letterSpacing:"0.03em", transition:"color 0.15s" }}>
                    {tier.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET — shows when a bubble is tapped */}
      {isMobile && selected && (
        <div className="bottom-sheet" style={{
          background: T.sheetBg,
          borderTop: `1px solid ${T.sheetBorder}`,
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ color: CATEGORIES[selected.cat].color, fontWeight:600, fontSize:16, marginBottom:6 }}>
                {selected.name}
              </div>
              <div style={{ color:T.ttText, fontSize:13, lineHeight:2 }}>
                <div>🏷 {selected.cat}</div>
                <div>💰 ~${selected.price} avg drink</div>
                <div style={{ color:T.ttSub, fontSize:11, marginTop:2 }}>{selected.address}</div>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{ background:"transparent", border:"none", color:T.ttSub, fontSize:22, cursor:"pointer", padding:"0 4px", lineHeight:1 }}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
