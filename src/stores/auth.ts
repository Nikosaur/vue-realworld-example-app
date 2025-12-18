import { defineStore } from 'pinia';
import ApiService from "@/common/api.service";
import JwtService from "@/common/jwt.service";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    errors: {} as any,
    user: {} as any,
    isAuthenticated: !!JwtService.getToken()
  }),
  getters: {
    currentUser(state) {
      return state.user;
    }
  },
  actions: {
    login(credentials: any) {
      return new Promise((resolve) => {
        ApiService.post("users/login", { user: credentials })
          .then(({ data }) => {
            this.setAuth(data.user);
            resolve(data);
          })
          .catch(({ response }) => {
            this.setError(response.data.errors);
          });
      });
    },
    logout() {
      this.purgeAuth();
    },
    register(credentials: any) {
      return new Promise((resolve, reject) => {
        ApiService.post("users", { user: credentials })
          .then(({ data }) => {
            this.setAuth(data.user);
            resolve(data);
          })
          .catch(({ response }) => {
            this.setError(response.data.errors);
            reject(response);
          });
      });
    },
    checkAuth() {
      if (JwtService.getToken()) {
        ApiService.setHeader();
        ApiService.get("user")
          .then(({ data }) => {
            this.setAuth(data.user);
          })
          .catch(({ response }) => {
            this.setError(response.data.errors);
          });
      } else {
        this.purgeAuth();
      }
    },
    updateUser(payload: any) {
      const { email, username, password, image, bio } = payload;
      const user: any = {
        email,
        username,
        bio,
        image
      };
      if (password) {
        user.password = password;
      }

      return ApiService.put("user", user).then(({ data }) => {
        this.setAuth(data.user);
        return data;
      });
    },
    setAuth(user: any) {
      this.isAuthenticated = true;
      this.user = user;
      this.errors = {};
      JwtService.saveToken(this.user.token);
    },
    purgeAuth() {
      this.isAuthenticated = false;
      this.user = {};
      this.errors = {};
      JwtService.destroyToken();
    },
    setError(error: any) {
      this.errors = error;
    }
  }
});
