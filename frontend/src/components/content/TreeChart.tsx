import { TreeNode } from '@/common/types';
import React from 'react';
import { Chart } from 'react-google-charts';

interface TreeProps {
  data: TreeNode;
}

const GoogleChartTree: React.FC<TreeProps> = ({ data }) => {
  const chartData: any[] = [
    [{ v: 'Node', f: 'Node' }, 'Parent', 'Tooltip'],
  ];

  const nodeMap = new Map<number, TreeNode>();

  const findRootNode = (node: TreeNode): TreeNode => {
    if (!node || !node.parent) {
      return node;
    }
    let currentNode = node;
    const visitedNodes = new Set<number>();

    while (currentNode.parent !== null && !visitedNodes.has(currentNode['@id'])) {
      visitedNodes.add(currentNode['@id']);

      if (typeof currentNode.parent === 'number') {
        const parentNode = nodeMap.get(currentNode.parent);
        if (parentNode) {
          currentNode = parentNode;
        } else {
          break;
        }
      } else if (typeof currentNode.parent === 'object') {
        currentNode = currentNode.parent;
      } else {
        break;
      }
    }
    return currentNode;
  };

  const rootNode = findRootNode(data);

  const buildNodeMap = (node: TreeNode) => {
    if (!node) return;
    if (nodeMap.has(node['@id'])) return;

    nodeMap.set(node['@id'], node);

    if (node.children) {
      node.children.forEach((child) => {
        if (typeof child === 'object') {
          buildNodeMap(child);
        } else if (typeof child === 'number') {
          if (!nodeMap.has(child)) {
            nodeMap.set(child, {
              '@id': child,
              parent: null,
              children: [],
              permutation: null,
              ub: 0,
              lb: 0,
              pruned: false,
            });
          }
        }
      });
    }
  };

  buildNodeMap(rootNode);

  const traverse = (node: TreeNode, parentId: string | null = null) => {
    if (!node || !node['@id']) return;

    const nodeId = `Node ${node['@id']}`;
    const parentNodeId = parentId;

    let tooltip = `UB: ${node.ub}, LB: ${node.lb}`;
    tooltip += node.pruned ? ', Pruned: Yes' : ', Pruned: No';
    tooltip += node.permutation ? `, Cmax: ${node.permutation.order}` : '';
    tooltip += node['@id'] === rootNode['@id'] ? ', Root Node' : '';

    const nodeStyle = node.pruned
      ? `<div style="color: red">${node.permutation}</div>`
      : nodeId;

    chartData.push([{ v: nodeId, f: nodeStyle }, parentNodeId, tooltip]);

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        let childNode: TreeNode | undefined;

        if (typeof child === 'number') {
          childNode = nodeMap.get(child);
        } else if (typeof child === 'object') {
          childNode = child;
        }

        if (childNode) {
          traverse(childNode, nodeId);
        }
      });
    }
  };

  traverse(rootNode);

  return (
    <Chart
      width={'100%'}
      height={'600px'}
      chartType="OrgChart"
      loader={<div>Loading Chart...</div>}
      data={chartData}
      options={{
        allowHtml: true,
        tooltip: { isHtml: true },
      }}
      rootProps={{ 'data-testid': '1' }}
    />
  );
};

export default GoogleChartTree;
