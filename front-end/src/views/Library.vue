<template>
<div class="library">
  <div v-if="user">
    <h1>Manage Our Library</h1>
    <div class="heading">
      <h1>-Add Movie-</h1>
    </div>
    <div class="add">
      <div class="form">
        <input v-model="title" placeholder="Title">
        <br />
        <input v-model="genre" placeholder="Genre">
        <br />
        <input v-model="duration" placeholder="Duration (minutes)">
        <br />
        <input v-model="starring" placeholder="Actor Name">
        <br />
        <textarea v-model="description" placeholder="Description" />
        <br />
        <input type="file" name="posterImage" @change="fileChanged">
        <button @click="upload">Upload</button>
      </div>
      <div class="upload" v-if="addMovie">
        <h2>{{addMovie.title}}</h2>
        <h3>{{addMovie.genre}}</h3>
        <h3>{{addMovie.duration}}</h3>
        <h3>{{addMovie.starring}}</h3>
        <h3>{{addMovie.description}}</h3>
        <img :src="addMovie.path" />
      </div>
    </div>

    <div class="heading">
      <h1>-Edit/Delete Movie-</h1>
    </div>
    <div class="edit">
      <div class="form">
        <div class="suggestions" v-if="suggestions.length > 0">
          <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectMovie(s)">{{s.title}}
          </div>
        </div>
      </div>
      <div class="upload" v-if="findMovie">
        <input v-model="findMovie.title" placeholder="Title">
        <br />
        <input v-model="findMovie.genre" placeholder="Genre">
        <br />
        <input v-model="findMovie.duration" placeholder="Duration (minutes)">
        <br />
        <input v-model="findMovie.starring" placeholder="Actor name">
        <br />
        <textarea v-model="findMovie.description" placeholder="Enter a description"/>
        <p></p>
        <img :src="findMovie.path" />
      </div>
      <div class="actions" v-if="findMovie">
        <button @click="deleteMovie(findMovie)">Delete</button>
        <br />
        <br />
        <button @click="editMovie(findMovie)">Edit</button>
      </div>
    </div>
  </div>
  <Login v-else />
</div>
</template>

<style scoped>
.library {
  padding-top: 120px;
}

h1 {
  text-align: center;
}
/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #cce6ff;
}
.image h2 {
  font-style: italic;
  font-size: 1em;
}

.heading {
  display: flex;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
}

.add,
.edit {
  display: flex;
}

/* Form */
input,
textarea,
select,
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

input {
  margin-bottom: 20px;
}


/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}

.menu {
  display: flex;
  justify-content: space-between;
}

.menu h2 {
  font-size: 14px;
}
</style>

<script>
import axios from 'axios';
import Login from '@/components/Login.vue';

export default {
  name: 'Library',
  components: {
    Login,
  },
  data() {
    return {
      title: "",
      description: "",
      genre: "",
      duration: null,
      starring: "",
      file: null,
      addMovie: null,
      movies: [],
      findTitle: "",
      findMovie: null,
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
  created() {
    this.getMovies();
  },
  computed: {
    suggestions() {
      let movies = this.movies.filter(movie => movie.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return movies.sort((a, b) => a.title > b.title);
    },
    user() {
      return this.$root.$data.user;
    }
  },
  methods: {
    async editMovie(movie) {
      try {
        await axios.put("/api/movies/" + movie._id, {
          title: movie.title,
          genre: movie.genre,
          duration: movie.duration,
          starring: movie.starring,
          description: movie.description,
        });
        this.findMovie = null;
        this.getMovies();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectMovie(movie) {
      this.findTitle = "";
      this.findMovie = movie;
    },
    async deleteMovie(movie) {
      try {
        await axios.delete("/api/movies/" + movie._id);
        this.findMovie = null;
        this.getMovies();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getMovies() {
      try {
        let response = await axios.get("/api/movies/all");
        this.movies = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('posterImage', this.file, this.file.name);
        formData.append('title', this.title);
        formData.append('genre', this.genre);
        formData.append('duration', this.duration);
        formData.append('starring', this.starring);
        formData.append('description', this.description);
        await axios.post("/api/movies", formData);
        this.file = null;
        this.url = "";
        this.title = "";
        this.genre = "";
        this.duration = "";
        this.starring = "";
        this.description = "";
        this.$emit('uploadFinished');
        this.getMovies();
        this.findMovie = null;
      } catch (error) {
        this.error = "Error: " + error.response.data.message;
      }
    },
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
