<template>
<div class="browse">
  <h1>Our Family's Movies</h1>
  <div class="pick" v-if="yourPick != null">
    <br />
    <h1>Grab some popcorn!  Tonight you selected to watch...</h1>
    <h2>{{yourPick.title}}</h2>
    <h3>{{yourPick.description}}</h3>
    <img :src="yourPick.path" />
    <h3>Genre: {{yourPick.genre}}</h3>
    <h3>Duration: {{yourPick.duration}} minutes</h3>
    <h3>Starring: {{yourPick.starring}}</h3>
    <h3>Uploaded By: {{yourPick.user.firstName}} {{yourPick.user.lastName}}</h3>
  </div>
  <div v-else>
    <section class="image-gallery">
      <div @click="yourPick=movie" class="image" v-for="movie in movies" :key="movie.id">
        <h2>{{movie.title}}</h2>
        <img :src="movie.path"/>
      </div>
    </section>
  </div>
</div>
</template>

<script>
// @ is an alias to /src

import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
     movies: [],
     yourPick: null,
     error: '',
    }
  },
  created() {
    this.getMovies();
  },
  methods: {
    async getMovies() {
      try {
        let response = await axios.get("/api/movies/all");
        this.movies = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
  }
}
</script>

<style scoped>
.pick {
  text-align: center;
}

.pick img {
  width: 400px;
}

.image h2 {
  font-style: italic;
  text-align: center;
}

.image:hover {
  transform: scale(1.1);
}

.browse {
  padding-top: 120px;
}

h3 {
  font-size: 14px;
}

.pick h2 {
  font-size: 18px;
}

/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.image-gallery {
  column-gap: 1.5em;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

.image img {
  width: 100%;
}

h1 {
  text-align: center;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .image-gallery {
    column-count: 4;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .image-gallery {
    column-count: 3;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  .image-gallery {
    column-count: 2;
  }
}
</style>
