import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";

const GITHUB_API_URL = "https://api.github.com"
const GITHUB_API_TOKEN = "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" //Remplaza con un token exitoso.

export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
  try{
    const response = await axios.get(`${GITHUB_API_URL}/user/repos`, {
      headers: {
        Authorization: `Bearer ${GITHUB_API_TOKEN}`,
      },
      params: {
        per_page:100,
        sort: "created",
        direction: "desc",
        affiliation: "owner"
      },
    });

    const reposData: RepositoryItem [] = response.data.map((repo: any) => ({
      name: repo.name,
      description: repo.description || null,
      imageUrl: repo.owner?.avatar_url || null,
      owner: repo.owner?.login || null,
      language: repo.language || null,
    }));

    return reposData;  
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
};
