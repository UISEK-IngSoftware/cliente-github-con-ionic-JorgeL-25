import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";
import { getAuth } from "../auth";

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL || "https://api.github.com";

const authHeaders = async () => {
  const auth = await getAuth();
  if (!auth?.token) {
    throw new Error("No hay sesión. Inicia sesión nuevamente.");
  }

  return {
    Authorization: `Bearer ${auth.token}`,
    Accept: "application/vnd.github+json",
  };
};

// GET /user/repos
export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
  const headers = await authHeaders();

  const response = await axios.get(`${GITHUB_API_URL}/user/repos`, {
    headers,
    params: {
      per_page: 100,
      sort: "created",
      direction: "desc",
      affiliation: "owner",
    },
  });

  return response.data.map((repo: any) => ({
    name: repo.name,
    description: repo.description || null,
    imageUrl: repo.owner?.avatar_url || null,
    owner: repo.owner?.login || null,
    language: repo.language || null,
  })) as RepositoryItem[];
};

// GET /user
export const getUserInfo = async (): Promise<UserInfo> => {
  const headers = await authHeaders();
  const response = await axios.get(`${GITHUB_API_URL}/user`, { headers });
  return response.data as UserInfo;
};

// POST /user/repos
export const createRepository = async (payload: {
  name: string;
  description?: string;
  private?: boolean;
}) => {
  const headers = await authHeaders();

  try {
    const response = await axios.post(`${GITHUB_API_URL}/user/repos`, payload, { headers });
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 422) {
      throw new Error(
        "No se pudo crear el repo (422). Probablemente el nombre ya existe o es inválido. Usa un nombre único sin espacios."
      );
    }

    throw new Error(error?.response?.data?.message || "Error creando repositorio");
  }
};
