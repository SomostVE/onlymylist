import React, { useState } from "react";
import data from "./data/kitsu_data.json";

export default function App() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  const filtered = data.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType ? item.subtype?.toLowerCase() === filterType.toLowerCase() : true;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>OnlyMyList</h1>

      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: "8px" }}>
        <option value="">Tous</option>
        <option value="TV">Anime TV</option>
        <option value="movie">Film</option>
        <option value="OVA">OVA</option>
        <option value="manga">Manga</option>
        <option value="manhwa">Manhwa</option>
        <option value="manhua">Manhua</option>
      </select>

      <div style={{ marginTop: "20px" }}>
        {filtered.map(item => (
          <div key={item.id} style={{ display: "flex", marginBottom: "15px" }}>
            {item.poster && <img src={item.poster} alt={item.title} style={{ width: "60px", marginRight: "15px" }} />}
            <div>
              <h3>{item.title}</h3>
              <p>{item.subtype} — {item.status}</p>
              {item.start_date && <p>{item.start_date} → {item.end_date || "en cours"}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
