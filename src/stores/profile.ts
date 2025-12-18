import { defineStore } from 'pinia';
import ApiService from "@/common/api.service";

export const useProfileStore = defineStore('profile', {
  state: () => ({
    errors: {} as any,
    profile: {} as any
  }),
  actions: {
    fetchProfile(payload: any) {
      const { username } = payload;
      return ApiService.get("profiles", username)
        .then(({ data }) => {
          this.profile = data.profile;
          this.errors = {};
          return data;
        })
        .catch(() => {
          // this.errors = response.data.errors;
        });
    },
    fetchProfileFollow(payload: any) {
      const { username } = payload;
      return ApiService.post(`profiles/${username}/follow`, {})
        .then(({ data }) => {
          this.profile = data.profile;
          return data;
        })
        .catch(() => {
          // this.errors = response.data.errors;
        });
    },
    fetchProfileUnfollow(payload: any) {
      const { username } = payload;
      return ApiService.delete(`profiles/${username}/follow`)
        .then(({ data }) => {
          this.profile = data.profile;
          return data;
        })
        .catch(() => {
          // this.errors = response.data.errors;
        });
    }
  }
});
