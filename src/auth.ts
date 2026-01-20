import storage, { initStorage } from "./storage";

const KEY_USER = "gh_username";
const KEY_TOKEN = "gh_token";

export const saveAuth = async (username: string, token: string) => {
  await initStorage();
  await storage.set(KEY_USER, username);
  await storage.set(KEY_TOKEN, token);
};

export const getAuth = async (): Promise<{ username: string; token: string } | null> => {
  await initStorage();
  const username = (await storage.get(KEY_USER)) as string | null;
  const token = (await storage.get(KEY_TOKEN)) as string | null;

  if (!username || !token) return null;
  return { username, token };
};

export const clearAuth = async () => {
  await initStorage();
  await storage.remove(KEY_USER);
  await storage.remove(KEY_TOKEN);
};

export const isAuthenticated = async (): Promise<boolean> => {
  const a = await getAuth();
  return !!a?.token;
};
