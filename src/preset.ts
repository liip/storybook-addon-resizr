import { fileURLToPath } from 'node:url';

export function previewAnnotations(entry: string[] = []) {
  return [...entry, fileURLToPath(import.meta.resolve('./preview.js'))];
}

export function managerEntries(entry: string[] = []) {
  return [...entry, fileURLToPath(import.meta.resolve('./manager.js'))];
}
