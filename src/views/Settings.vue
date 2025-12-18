<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <form @submit.prevent="updateSettings()">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  v-model="form.image"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  v-model="form.username"
                  placeholder="Your username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  v-model="form.bio"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  v-model="form.email"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  v-model="form.password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <!-- Line break for logout button -->
          <hr />
          <button @click="logout" class="btn btn-outline-danger">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const currentUser = computed(() => authStore.currentUser);

// Local state for the form to avoid strict mode violations if mutating props/store directly
const form = reactive({
  image: '',
  username: '',
  bio: '',
  email: '',
  password: ''
});

// Sync form with currentUser when it changes
watch(currentUser, (newUser) => {
  if (newUser) {
    form.image = newUser.image || '';
    form.username = newUser.username || '';
    form.bio = newUser.bio || '';
    form.email = newUser.email || '';
    // password usually not returned or shouldn't be prefilled? Original code had it v-model to currentUser.password, but usually it's blank.
    // If original code had it, currentUser object must have had a password field? Usually not.
  }
}, { immediate: true, deep: true });

const updateSettings = () => {
  // Dispatch the form data
  authStore.updateUser(form).then(() => {
    router.push({ name: "home" });
  });
};

const logout = () => {
  authStore.logout();
  router.push({ name: "home" });
};
</script>

<style scoped></style>
