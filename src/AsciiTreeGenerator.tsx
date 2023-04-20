import React, { useState, useEffect } from "react";
import axios from "axios";
import { generateAsciiTree, TreeNode } from "./asciiTree";

interface Props {
  repoUrl: string;
}

interface GitHubItem {
  path: string;
  type: string;
}

const generateTree = (repoName: string, items: GitHubItem[]) => {
  const treeData: TreeNode = {
    label: repoName + "/",
    nodes: [],
  };

  const traverse = (currentPath: string, nodes: TreeNode[]) => {
  items
    .filter((item) => item.path.startsWith(currentPath) && item.path.slice(currentPath.length + 1).indexOf("/") === -1)
    .forEach((item) => {
      const name = item.path.split("/").pop() || "";
      const newNode: TreeNode = { label: item.type === "tree" ? name + "/" : name, nodes: [] };
      nodes.push(newNode);
      if (item.type === "tree") {
        traverse(item.path + "/", newNode.nodes);
      }
    });
  };

  traverse("", treeData.nodes);
  return treeData;
};

const AsciiTreeGenerator: React.FC<Props> = ({ repoUrl }) => {
  const [asciiTree, setAsciiTree] = useState("");

  useEffect(() => {
    const fetchRepoData = async () => {
      const { owner, repo } = extractOwnerAndRepo(repoUrl);
      const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
      try {
        const response = await axios.get<{ tree: GitHubItem[] }>(url);
        const tree = generateTree(repo, response.data.tree);
        setAsciiTree(generateAsciiTree(tree));
      } catch (error) {
        console.error("Error fetching repository data:", error);
      }
    };

    fetchRepoData();
  }, [repoUrl]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(asciiTree);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div style={styles.asciiTreeContainer}>
      <button onClick={copyToClipboard} disabled={!asciiTree} style={styles.copyButton}>
        Copy Tree to Clipboard
      </button>
      <pre>{asciiTree || "Loading..."}</pre>
    </div>
  );
};

const extractOwnerAndRepo = (repoUrl: string) => {
  const match = repoUrl.match(/github.com\/(.+?)\/(.+?)(?:\/|$)/);
  if (!match) throw new Error("Invalid GitHub repository URL");
  return { owner: match[1], repo: match[2] };
};

export default AsciiTreeGenerator;

const styles = {
  asciiTreeContainer: {
    textAlign: "left" as const,
    whiteSpace: "pre-wrap" as const,
    maxWidth: "100%",
    overflowX: "auto" as const,
  },
  copyButton: {
    padding: "6px 10px",
  }
};
