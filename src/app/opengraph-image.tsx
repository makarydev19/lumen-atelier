import { ImageResponse } from "next/og";

export const alt = "Lumen Atelier — Rooms that hold the light.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          background: "#F3EEE6",
          color: "#1C1A18",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: "#5C564E", marginBottom: 36 }}>
            Lumen Atelier — Lisbon · Copenhagen
          </div>
          <div style={{ fontSize: 120, lineHeight: 0.95, letterSpacing: -4, display: "flex", flexDirection: "column" }}>
            <span>Rooms that</span>
            <span>hold the</span>
            <span style={{ fontStyle: "italic", color: "#B4532F" }}>light.</span>
          </div>
        </div>
        <div
          style={{
            width: 260,
            height: 420,
            borderRadius: "130px 130px 0 0",
            background: "linear-gradient(180deg, #FFF8EC 0%, #E2D6C5 70%, #CDBDA8 100%)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 70, height: 110, borderRadius: "35px 35px 10px 10px", background: "#B4532F", marginBottom: 40 }} />
        </div>
      </div>
    ),
    size,
  );
}
