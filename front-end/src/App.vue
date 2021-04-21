<template>
  <div id="app">
    <header id="header">
      <h1>Movie Recommender</h1>
      <nav>
        <router-link to="/"><i class="fas fa-home"></i></router-link>
        <router-link to="/mymovies"><i class="fas fa-user"></i></router-link>
        <router-link to="/browse"><i class="fas fa-users"></i></router-link>
        <router-link v-if="user" to="/library"><i class="fas fa-poll-h"></i></router-link>

        <div v-if="user">
          <div class="menu">
            <a @click="logout"><i class="fas fa-sign-out-alt"></i></a>
          </div>
        </div>
      </nav>
      <div v-if="user">
        <h2>Logged in as:  {{user.firstName}} {{user.lastName}}</h2>
      </div>
    </header>
    <router-view />

    <div class="footer">
      <div class="footer-item">
        <a href="https://github.com/ashtyntaylor/final-project">Github Repository</a>
        <p>Hours Spent: 7</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Login from '@/components/Login.vue';

export default {
  name: 'App',
  components: {
    Login,
  },
  data() {
    return {
    }
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
  }
}
</script>

<style>
body {
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  font-size: 13pt;
  margin: 0px 200px;
  color: #1C454F;
}

#header {
  /* Full Header */
  margin: 0 1em 1em 0;
  height: 100px;
  width: 100%;
  /* Fixed position */
  position: fixed;
  z-index: 10000;
  left: 50%;
  transform: translate(-50%, 0);
  /* Color and alignment */
  background: #99ccff;
  text-align: center;
  box-shadow: 0 0 0 1em #99ccff;
}

nav {
  display: flex;
  justify-content: center;
}

h1 {
  color: #1C454F;
  font-size: 18px;
}

h2 {
  color: #1C454F;
  font-size: 12px;
}

#header .fas {
  font-size: 25px;
  color: #1C454F;
  width: 50px;
}

.pure-button-primary {
  background-color: #277E8E;
}

/* Footer */
.footer a {
  color: #1C454F;
  text-decoration: none;
}

.footer a:hover {
  color: #99ccff;
}

.footer-item {
  text-align: center;
  flex: 1;
  padding-top: 30px;
}

h2 {
  padding-top: 10px;
}

</style>
