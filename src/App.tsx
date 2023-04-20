import React, { useState } from "react";
import AsciiTreeGenerator from "./AsciiTreeGenerator";

const App: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState("");

  return (
    <div style={styles.app}>
      <header style={styles.appHeader}>
        <h3>GitHub Repository ASCII Tree Generator</h3>
        <input
          type="text"
          placeholder="Paste GitHub repo URL here"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          style={styles.input}
        />
        {repoUrl && <AsciiTreeGenerator repoUrl={repoUrl} />}
      </header>
    </div>
  );
};

export default App;

const styles = {
  app: {
    textAlign: "center" as const,
  },
  appHeader: {
    backgroundColor: "#282c34",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
  },
  input: {
    width: "40%",
    padding: "6px 10px",
  }
};
