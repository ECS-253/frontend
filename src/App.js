import { useState } from "react";
import GraphViewer from "./GraphViewer";

function App() {
  const [file, setFile] = useState("all");
  const [bipartite, setBipartite] = useState(0);
  const [showLabel, setShowLabel] = useState(false);

  const buttonStyle = {
    padding: "2rem 4rem",
    fontSize: "3rem",
    cursor: "pointer",
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "1rem",
          justifyContent: "space-evenly",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={buttonStyle} onClick={() => setFile("all")}>
            All
          </button>
          <button style={buttonStyle} onClick={() => setFile("high_star")}>
            High Star
          </button>
          <button style={buttonStyle} onClick={() => setFile("low_star")}>
            Low Star
          </button>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={buttonStyle} onClick={() => setFile("user_all")}>
            All - User
          </button>
          <button style={buttonStyle} onClick={() => setFile("user_h")}>
            High Star - User
          </button>
          <button style={buttonStyle} onClick={() => setFile("user_l")}>
            Low Star - User
          </button>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            style={buttonStyle}
            onClick={() => setBipartite(1 - bipartite)}
          >
            Toggle Bipartite
          </button>
          <button style={buttonStyle} onClick={() => setShowLabel(!showLabel)}>
            Toggle Label
          </button>
        </div>
      </div>
      <GraphViewer
        apiUrl={`http://localhost:8000/graph?file=${file}.gpickle&bipartite=${bipartite}`}
        show={showLabel}
      />
    </>
  );
}

export default App;
