export interface TreeNode {
  label: string;
  nodes: TreeNode[];
}

export const generateAsciiTree = (treeData: TreeNode): string => {
  const lines: string[] = [];
  const traverse = (node: TreeNode, prefix = "", nextPrefix = "") => {
    lines.push(prefix + node.label);
    const isLastChild = (index: number) => index === node.nodes.length - 1;
    node.nodes.forEach((childNode, index) => {
      const childPrefix = isLastChild(index) ? "└─ " : "├─ ";
      const nextChildPrefix = isLastChild(index) ? "   " : "│  ";
      traverse(childNode, nextPrefix + childPrefix, nextPrefix + nextChildPrefix);
    });
  };
  traverse(treeData);
  return lines.join("\n");
};
