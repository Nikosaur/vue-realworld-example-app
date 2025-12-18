import axios, { AxiosResponse } from "axios";
import JwtService from "@/common/jwt.service";
import { API_URL } from "@/common/config";

const instance = axios.create({
  baseURL: API_URL
});

const ApiService = {
  init() {
    // Already handled by create
  },

  setHeader() {
    instance.defaults.headers.common[
      "Authorization"
    ] = `Token ${JwtService.getToken()}`;
  },

  query(resource: string, params: any): Promise<AxiosResponse> {
    return instance.get(resource, params).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  get(resource: string, slug = ""): Promise<AxiosResponse> {
    return instance.get(`${resource}/${slug}`).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  post(resource: string, params: any): Promise<AxiosResponse> {
    return instance.post(`${resource}`, params);
  },

  update(resource: string, slug: string, params: any): Promise<AxiosResponse> {
    return instance.put(`${resource}/${slug}`, params);
  },

  put(resource: string, params: any): Promise<AxiosResponse> {
    return instance.put(`${resource}`, params);
  },

  delete(resource: string): Promise<AxiosResponse> {
    return instance.delete(resource).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
};

export default ApiService;

export const TagsService = {
  get(): Promise<AxiosResponse> {
    return ApiService.get("tags");
  }
};

export const ArticlesService = {
  query(type: string, params: any): Promise<AxiosResponse> {
    return ApiService.query("articles" + (type === "feed" ? "/feed" : ""), {
      params: params
    });
  },
  get(slug: string): Promise<AxiosResponse> {
    return ApiService.get("articles", slug);
  },
  create(params: any): Promise<AxiosResponse> {
    return ApiService.post("articles", { article: params });
  },
  update(slug: string, params: any): Promise<AxiosResponse> {
    return ApiService.update("articles", slug, { article: params });
  },
  destroy(slug: string): Promise<AxiosResponse> {
    return ApiService.delete(`articles/${slug}`);
  }
};

export const CommentsService = {
  get(slug: string): Promise<AxiosResponse> {
    if (typeof slug !== "string") {
      throw new Error(
        "[RWV] CommentsService.get() article slug required to fetch comments"
      );
    }
    return ApiService.get("articles", `${slug}/comments`);
  },

  post(slug: string, payload: any): Promise<AxiosResponse> {
    return ApiService.post(`articles/${slug}/comments`, {
      comment: { body: payload }
    });
  },

  destroy(slug: string, commentId: string): Promise<AxiosResponse> {
    return ApiService.delete(`articles/${slug}/comments/${commentId}`);
  }
};

export const FavoriteService = {
  add(slug: string): Promise<AxiosResponse> {
    return ApiService.post(`articles/${slug}/favorite`, {});
  },
  remove(slug: string): Promise<AxiosResponse> {
    return ApiService.delete(`articles/${slug}/favorite`);
  }
};
