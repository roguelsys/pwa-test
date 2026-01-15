import { openDB } from "https://unpkg.com/idb?module";

const dbPromise = idb.openDB('map-pwa-db', 1, {
  upgrade(db) {
    db.createObjectStore('circles', { keyPath: 'id', autoIncrement: true });
  }
});

async function saveCircle(circle) {
  const db = await dbPromise;
  await db.add('circles', circle);
}

async function getCircles() {
  const db = await dbPromise;
  return await db.getAll('circles');
}
