import { Storage } from "@ionic/storage";

const storage = new Storage();
let storageReady: Promise<Storage> | null = null;

export const initStorage = async () => {
  if (!storageReady) {
    storageReady = storage.create();
  }
  return storageReady;
};

export default storage;
