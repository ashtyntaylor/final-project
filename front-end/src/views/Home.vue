<template>
<div class="home">
  <p>Can't decide what movie to watch tonight?  We'll help you out!  Filter the movies any way you'd like and then press "Pick for Me"!</p>
  <br />
  <div class="heading">
    <h2>Filter Movies By:</h2>
    <div class="filterButtons">
      <button @click="searchBy('name')">Name</button>
      <button @click="searchBy('star')">Starring</button>
      <button @click="searchBy('duration')">Duration</button>
      <button @click="searchBy('genre')">Genre</button>
      <br />
    </div>
    <div class="form" v-if="searchType==='name'">
      <p>Is there a particular movie you're looking for?</p>
      <input v-model="nameFilter" placeholder="Enter Movie Name"/>
    </div>
    <div class="form" v-if="searchType==='star'">
      <p>Which actor do you want to watch?</p>
      <input v-model="starFilter" placeholder="Enter Actor Name"/>
    </div>
    <div class="form" v-if="searchType==='duration'">
      <p>How much time do you have to watch a movie (minutes)?</p>
      <input v-model="durationFilter"/>
    </div>
    <div class="form" v-if="searchType==='genre'">
      <div class="form">
        <div class="genres" v-if="genres.length > 0">
          <select v-model="genreFilter" name="genre">
            <option v-for="genre in genres" :key="genre" @click="selectGenre(genre)">{{genre}}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <div class="pickButton">
    <button @click="recommend">Pick for Me!</button>
  </div>  <br />
  <br />
  <br/>
  <div class="recommendation" v-if="recommendation != null">
    <h1>Grab some popcorn!  Tonight you should watch...</h1>
    <h2>{{recommendation.title}}</h2>
    <h3>{{recommendation.description}}</h3>
    <img :src="recommendation.path" />
    <h3>Genre: {{recommendation.genre}}</h3>
    <h3>Duration: {{recommendation.duration}} minutes</h3>
    <h3>Starring: {{recommendation.starring}}</h3>
    <h3>Uploaded By: {{recommendation.user.firstName}} {{recommendation.user.lastName}}</h3>
  </div>
  <div v-else>
    <section class="image-gallery">
      <div @click="recommendation=movie" class="image" v-for="movie in filteredMovies" :key="movie.id">
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
  name: 'Watch',
  data() {
    return {
     genres: [],
     movies: [],
     genreFilter: "",
     durationFilter: 0,
     starFilter: "",
     nameFilter: "",
     searchType: "",
     recommendation: null,
    }
  },
  created() {
    this.getGenres();
  },
  computed: {

    filteredMovies() {

      if(this.searchType === 'name'){

        if(this.nameFilter != ''){
          return this.movies.filter(movie => {
            return movie.title.toLowerCase().includes(this.nameFilter.toLowerCase());
          });
        }

      }else if(this.searchType == 'star'){

        if(this.starFilter != ''){
          return this.movies.filter(movie => {
            return movie.starring != null && movie.starring.toLowerCase().includes(this.starFilter.toLowerCase());
          });
        }

      }else if(this.searchType == 'duration'){

        if(this.durationFilter > 0){
          return this.movies.filter(movie => {
            return movie.duration == null ||
                   movie.duration <= parseInt(this.durationFilter);
          });
        }

      }else if(this.searchType == 'genre'){

        if(this.genreFilter != ''){
          return this.movies.filter(movie => {
            return movie.genre == this.genreFilter;
          });
        }
      }

      return this.movies;
    }
  },
  methods: {
    async getGenres() {
      try {
        let response = await axios.get("/api/movies/all");
        this.movies = response.data;
        this.genres = [];
        var lookup = {};
        for (var i = 0; i < this.movies.length; i++) {
          var genre = this.movies[i].genre;

          if(!(genre in lookup)) {
            lookup[genre] = 1;
            this.genres.push(genre);
          }
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    selectGenre(genre) {
      this.genreFilter = genre;
      this.randomMovie(this.filteredMovies);
    },

    getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
    },

    recommend() {
      let pick = this.getRandom(0, this.filteredMovies.length - 1);
      this.recommendation = this.filteredMovies[pick];
    },
    searchBy(parameter) {
      this.recommendation = null;
      this.searchType = parameter;
    },
  }
}
</script>

<style scoped>
p {
  text-align: center;
}
.image h2 {
  font-style: italic;
}

.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading p {
  text-align: left;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 25%
}

.edit {
  display: flex;
}

/* Form */
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.pickButton {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  margin-right: 50px;
}

.genres {
  width: 200px;
}

.genre {
  min-height: 20px;

}

.genre:hover {
  background-color: #5BDEFF;
  color: #fff;
}

select {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.recommendation {
  text-align: center;
}

.recommendation img {
  width: 400px;
}

.image h2 {
  font-style: italic;
  text-align: center;
}

.image:hover {
  transform: scale(1.1);
}

.home {
  padding-top: 120px;
}

h3 {
  font-size: 14px;
}

.recommendation h2 {
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

.filterButtons {
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  margin: 3px;
}

select {
  margin: 10px;
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
