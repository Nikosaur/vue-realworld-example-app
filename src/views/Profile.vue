<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <div v-if="isCurrentUser()">
              <router-link
                class="btn btn-sm btn-outline-secondary action-btn"
                :to="{ name: 'settings' }"
              >
                <i class="ion-gear-a"></i> Edit Profile Settings
              </router-link>
            </div>
            <div v-else>
              <button
                class="btn btn-sm btn-secondary action-btn"
                v-if="profile.following"
                @click.prevent="unfollow()"
              >
                <i class="ion-plus-round"></i> &nbsp;Unfollow
                {{ profile.username }}
              </button>
              <button
                class="btn btn-sm btn-outline-secondary action-btn"
                v-if="!profile.following"
                @click.prevent="follow()"
              >
                <i class="ion-plus-round"></i> &nbsp;Follow
                {{ profile.username }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  active-class="active"
                  exact
                  :to="{ name: 'profile' }"
                >
                  My Articles
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  active-class="active"
                  exact
                  :to="{ name: 'profile-favorites' }"
                >
                  Favorited Articles
                </router-link>
              </li>
            </ul>
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';

const profileStore = useProfileStore();
const authStore = useAuthStore();
const route = useRoute();

const currentUser = computed(() => authStore.currentUser);
const profile = computed(() => profileStore.profile);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const isCurrentUser = () => {
  if (currentUser.value.username && profile.value.username) {
    return currentUser.value.username === profile.value.username;
  }
  return false;
};

const follow = () => {
  if (!isAuthenticated.value) return;
  profileStore.fetchProfileFollow(route.params);
};

const unfollow = () => {
  profileStore.fetchProfileUnfollow(route.params);
};

onMounted(() => {
  profileStore.fetchProfile(route.params);
});

watch(() => route.params, (params) => {
  profileStore.fetchProfile(params);
});
</script>

<style scoped></style>
