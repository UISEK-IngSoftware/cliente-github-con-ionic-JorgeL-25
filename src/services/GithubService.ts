import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";

const GITHUB_API_URL =
  import.meta.env.VITE_GITHUB_API_URL || "https://api.github.com";
const RAW_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

//Headers centralizados (evita 401)
const authHeaders = () => {
  if (!RAW_TOKEN) {
    throw new Error("Token no encontrado. Revisa .env y reinicia npm run dev");
  }

  return {
    Authorization: `Bearer ${RAW_TOKEN}`,
    Accept: "application/vnd.github+json",
  };
};

//GET /user/repos
export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/user/repos`, {
      headers: authHeaders(),
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
  } catch (error: any) {
    console.error("Error fetching repositories:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Error obteniendo repositorios"
    );
  }
};

//GET /user (tipado)
export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/user`, {
      headers: authHeaders(),
    });
    return response.data as UserInfo;
  } catch (error: any) {
    console.error("Error fetching user info:", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Error obteniendo usuario");
  }
};

//POST /user/repos
export const createRepository = async (payload: {
  name: string;
  description?: string;
  private?: boolean;
}) => {
  try {
    const response = await axios.post(`${GITHUB_API_URL}/user/repos`, payload, {
      headers: authHeaders(),
    });

    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message;

    // 422 suele ser: nombre repetido o inválido
    if (status === 422) {
      throw new Error(
        "No se pudo crear el repo (422). Probablemente el nombre ya existe o es inválido. Usa un nombre único sin espacios."
      );
    }

    console.error("Error creating repo:", error?.response?.data || error);
    throw new Error(msg || "Error creando repositorio");
  }
};
