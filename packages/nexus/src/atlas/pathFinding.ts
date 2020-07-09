import { PathFindingNode, Nodes } from '../types/types';

export function pathFinding(nodes: Nodes, start: string, end: string): {id: string, dir: string}[] {
  const toExplore: PathFindingNode[] = [{id: start, w: 0}];
  const explored: PathFindingNode[] = [];
  while (toExplore.length > 0) {
    const current = toExplore.splice(0, 1)[0];
    const alreadyExplored = explored.find(i => i.id === current.id);
    let cheaper = false;
    if (alreadyExplored && alreadyExplored.w > current.w ) {
      // If we get to an already explored node with less weight, should be updated
      const ind = explored.findIndex(i => i.id === current.id);
      explored[ind] = {...current};
      cheaper = true;
    }
    if (!alreadyExplored || cheaper) {
      for (const i in nodes[current.id]) {
        const beforeInsert = explored.find(j => j.id === i);
        if (!beforeInsert || (beforeInsert.w < current.w + nodes[current.id][i].w)) {
          toExplore.push({
            id: i,
            w: current.w + nodes[current.id][i].w,
            from: current.id,
            dir: nodes[current.id][i].dir
          });
        }
      }
    }
    if (!alreadyExplored) {
      explored.push(current);
    }
  }

  const foundEnd = explored.find(i => i.id === end);

  if (!foundEnd) {
    throw new Error('Not reachable');
  }

  const path = [foundEnd];
  while(path[0].id !== start) {
    path.unshift(explored.find(i => i.id === path[0].from));
  }
  return path.map(i => ({id: i.id, dir: i.dir}));
}
