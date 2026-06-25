export const initialNodes = [
  {
    id: '1',
    type: 'startEnd',
    data: { label: 'Start' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'decision',
    data: { label: 'Is it raining?' },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    type: 'process',
    data: { label: 'Take Umbrella' },
    position: { x: 100, y: 250 },
  },
  {
    id: '4',
    type: 'process',
    data: { label: 'Go Outside' },
    position: { x: 400, y: 250 },
  },
  {
    id: '5',
    type: 'startEnd',
    data: { label: 'End' },
    position: { x: 250, y: 400 },
  },
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'yes' },
  { id: 'e2-3', source: '2', target: '3', label: 'yes' },
  { id: 'e2-4', source: '2', target: '4', label: 'no' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
];
