import React, { useMemo, useCallback, useRef } from 'react';
import { TreeNode } from '@/common/types';
import Tree from 'react-d3-tree';
import CustomTreeNode from './CustomTreeNode';

interface TreeProps {
  data: TreeNode;
  height?: number;
}

const CustomTree: React.FC<TreeProps> = ({ data, height=600 }) => {
  const treeContainer = useRef<HTMLDivElement>(null);
  const nodeSize = { x: 200, y: 200 };

  const treeData = useMemo(() => {
    if (!data) return null;

    const nodeMap = new Map<number, TreeNode>();

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
                active: false,
              });
            }
          }
        });
      }
    };

    buildNodeMap(data);

    const convertToD3Tree = (() => {
      const cache = new Map<number, any>();

      return (nodeId: number): any => {
        if (cache.has(nodeId)) {
          return cache.get(nodeId);
        }

        const node = nodeMap.get(nodeId);
        if (!node) return null;

        const nodeName = `Node ${node['@id']}`;
        const nodeData: any = {
          name: nodeName,
          attributes: {
            ub: node.ub,
            lb: node.lb,
            pruned: node.pruned,
            active: node.active,
          },
        };

        if (node.permutation) {
          nodeData.attributes['cmax'] = node.permutation.cmax;
        }

        if (node.children && node.children.length > 0) {
          nodeData.children = node.children
            .map((child) => {
              if (typeof child === 'number') {
                return convertToD3Tree(child);
              } else if (typeof child === 'object') {
                return convertToD3Tree(child['@id']);
              }
              return null;
            })
            .filter(Boolean);
        }

        cache.set(nodeId, nodeData);
        return nodeData;
      };
    })();

    return convertToD3Tree(data['@id']);
  }, [data]);

  const renderNode = useCallback(
    ({ nodeDatum }: { nodeDatum: any }) => {
      const { name, attributes } = nodeDatum;

      return (
        <g>
          <foreignObject
            width={nodeSize.x}
            height={nodeSize.y}
            x={-nodeSize.x / 2}
            y={-nodeSize.y / 2}
          >
            <CustomTreeNode
              header={name}
              isActive={attributes['active']}
              isPruned={attributes['pruned']}
              cmax={attributes['cmax']}
              ub={attributes['ub']}
              lb={attributes['lb']}
            />
          </foreignObject>
        </g>
      );
    },
    [nodeSize.x, nodeSize.y]
  );

  return (
    <div style={{ width: '100%', height: height }} ref={treeContainer}>
      {treeData && (
        <Tree
          data={treeData}
          translate={{ x: 500, y: 150 }}
          nodeSize={nodeSize}
          renderCustomNodeElement={renderNode}
          orientation="vertical"
          pathFunc="diagonal"
          separation={{ siblings: 2, nonSiblings: 2 }}
        />
      )}
    </div>
  );
};

export default CustomTree;
