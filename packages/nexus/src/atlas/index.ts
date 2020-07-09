import { Express } from 'express';
import { pathFinding } from './pathFinding';
import * as pathFindingNodes from './pathFinding.json';

export function initAtlas(app: Express): void {
  app.get('/path', function (req, res) {
    if (!req.query.from || !req.query.to) {
      res.status(400).send();
    }
    const from = req.query.from.toString();
    const to = req.query.to.toString();

    try {
      const route = pathFinding(pathFindingNodes, from, to);
      res.send(route);
    } catch (error) {
      if (error.message === 'Not reachable') {
        res.status(400).send();
      } else {
        console.error(error);
        res.status(500).send();
      }
    }
  });
}