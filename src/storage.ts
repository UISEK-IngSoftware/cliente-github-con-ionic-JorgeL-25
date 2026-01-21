import { Storage, Drivers } from "@ionic/storage";

const storage = new Storage({
  name: "github_client_db",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

//create() SOLO una vez (singleton)
let storageReady: Promise<Storage> | null = null;

export const initStorage = async () => {
  if (!storageReady) {
    storageReady = storage.create();
  }
  return storageReady;
};

export default storage;
