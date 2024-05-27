import { v4 as uuidv4 } from 'uuid';

export function generateShortUUID(lenght: number) {
  const uuid = uuidv4().replace(/-/g, '');
  return uuid.slice(0, lenght);
}
