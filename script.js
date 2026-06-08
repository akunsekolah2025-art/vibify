// ======================
// ELEMENT
// ======================

const playlistContainer = document.getElementById("playlist");
const addSongBtn = document.getElementById("addSongBtn");

const titleInput = document.getElementById("songTitle");
const artistInput = document.getElementById("songArtist");

const audioFileInput = document.getElementById("audioFile");
const coverFileInput = document.getElementById("coverFile");
const coverUrlInput = document.getElementById("coverUrl");

const searchInput = document.getElementById("searchInput");

const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progressBar = document.getElementById("progressBar");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");

const currentCover = document.getElementById("currentCover");

const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerCover = document.getElementById("playerCover");

const songCount = document.getElementById("songCount");

const splashScreen = document.getElementById("splash-screen");

// ======================
// DEFAULT COVER
// ======================

const DEFAULT_COVER = "assets/logo.png";

// ======================
// DATA
// ======================

let songs =
JSON.parse(localStorage.getItem("vibifySongs")) || [];

let currentSongIndex = -1;
let isPlaying = false;

// ======================
// SPLASH SCREEN
// ======================

window.addEventListener("load", () => {

    setTimeout(() => {

        splashScreen.style.opacity = "0";
        splashScreen.style.transition = "0.5s";

        setTimeout(() => {
            splashScreen.remove();
        }, 500);

    }, 1500);

});

// ======================
// SAVE
// ======================

function saveSongs() {

    localStorage.setItem(
        "vibifySongs",
        JSON.stringify(songs)
    );

}

// ======================
// FORMAT TIME
// ======================

function formatTime(seconds) {

    if (isNaN(seconds)) return "0:00";

    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if (secs < 10) secs = "0" + secs;

    return `${mins}:${secs}`;

}

// ======================
// FILE TO BASE64
// ======================

function fileToBase64(file) {

    return new Promise(resolve => {

        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.readAsDataURL(file);

    });

}

// ======================
// RENDER PLAYLIST
// ======================

function renderPlaylist(list = songs) {

    playlistContainer.innerHTML = "";

    songCount.textContent =
        songs.length + " Lagu";

    if (list.length === 0) {

        playlistContainer.innerHTML = `
            <div style="
            padding:30px;
            background:#151515;
            border-radius:20px;
            text-align:center;">
            Belum ada lagu
            </div>
        `;

        return;
    }

    list.forEach((song, index) => {

        const card = document.createElement("div");

        card.className = "song-card";

        if(index === currentSongIndex){
            card.classList.add("active");
        }

        card.innerHTML = `
            <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>

            <img src="${song.cover}">

            <h4>${song.title}</h4>

            <p>${song.artist}</p>
        `;

        card.addEventListener("click", () => {

            loadSong(index);
            playSong();

        });

        card.querySelector(".delete-btn")
        .addEventListener("click", (e) => {

            e.stopPropagation();

            deleteSong(index);

        });

        playlistContainer.appendChild(card);

    });

}

// ======================
// DELETE SONG
// ======================

function deleteSong(index) {

    if(!confirm("Hapus lagu ini?")) return;

    songs.splice(index,1);

    saveSongs();

    if(index === currentSongIndex){

        audio.pause();

        currentSongIndex = -1;

    }

    renderPlaylist();

}

// ======================
// LOAD SONG
// ======================

function loadSong(index){

    currentSongIndex = index;

    const song = songs[index];

    audio.src = song.audio;

    currentTitle.textContent =
        song.title;

    currentArtist.textContent =
        song.artist;

    playerTitle.textContent =
        song.title;

    playerArtist.textContent =
        song.artist;

    currentCover.src = song.cover;
    playerCover.src = song.cover;

    renderPlaylist();

}

// ======================
// PLAY
// ======================

function playSong(){

    if(currentSongIndex === -1) return;

    audio.play();

    isPlaying = true;

    playBtn.innerHTML =
    `<i class="fa-solid fa-pause"></i>`;

    currentCover.classList.add("rotating");
    playerCover.classList.add("rotating");

}

// ======================
// PAUSE
// ======================

function pauseSong(){

    audio.pause();

    isPlaying = false;

    playBtn.innerHTML =
    `<i class="fa-solid fa-play"></i>`;

    currentCover.classList.remove("rotating");
    playerCover.classList.remove("rotating");

}

// ======================
// PLAY BUTTON
// ======================

playBtn.addEventListener("click", () => {

    if(currentSongIndex === -1) return;

    if(isPlaying){
        pauseSong();
    }else{
        playSong();
    }

});

// ======================
// NEXT
// ======================

nextBtn.addEventListener("click", () => {

    if(songs.length === 0) return;

    currentSongIndex++;

    if(currentSongIndex >= songs.length){
        currentSongIndex = 0;
    }

    loadSong(currentSongIndex);
    playSong();

});

// ======================
// PREVIOUS
// ======================

prevBtn.addEventListener("click", () => {

    if(songs.length === 0) return;

    currentSongIndex--;

    if(currentSongIndex < 0){
        currentSongIndex = songs.length - 1;
    }

    loadSong(currentSongIndex);
    playSong();

});

// ======================
// PROGRESS
// ======================

audio.addEventListener("timeupdate", () => {

    if(!audio.duration) return;

    progressBar.value =
    (audio.currentTime / audio.duration) * 100;

    currentTimeEl.textContent =
    formatTime(audio.currentTime);

    durationEl.textContent =
    formatTime(audio.duration);

});

// ======================
// SEEK
// ======================

progressBar.addEventListener("input", () => {

    if(!audio.duration) return;

    audio.currentTime =
    (progressBar.value / 100) *
    audio.duration;

});

// ======================
// AUTO NEXT
// ======================

audio.addEventListener("ended", () => {

    if(songs.length === 0) return;

    currentSongIndex++;

    if(currentSongIndex >= songs.length){
        currentSongIndex = 0;
    }

    loadSong(currentSongIndex);
    playSong();

});

// ======================
// SEARCH
// ======================

searchInput.addEventListener("input", () => {

    const keyword =
    searchInput.value.toLowerCase();

    const filtered =
    songs.filter(song =>

        song.title
        .toLowerCase()
        .includes(keyword)

        ||

        song.artist
        .toLowerCase()
        .includes(keyword)

    );

    renderPlaylist(filtered);

});

// ======================
// ADD SONG
// ======================

addSongBtn.addEventListener(
"click",
async () => {

    const title =
    titleInput.value.trim();

    const artist =
    artistInput.value.trim();

    const audioFile =
    audioFileInput.files[0];

    if(
        !title ||
        !artist ||
        !audioFile
    ){
        alert("Lengkapi data lagu");
        return;
    }

    const audioBase64 =
    await fileToBase64(audioFile);

    let cover = DEFAULT_COVER;

    const coverFile =
    coverFileInput.files[0];

    if(coverFile){

        cover =
        await fileToBase64(
            coverFile
        );

    }else if(
        coverUrlInput.value.trim()
    ){

        cover =
        coverUrlInput.value.trim();

    }

    songs.push({

        title,
        artist,
        cover,
        audio:audioBase64

    });

    saveSongs();

    renderPlaylist();

    titleInput.value = "";
    artistInput.value = "";

    coverUrlInput.value = "";

    audioFileInput.value = "";
    coverFileInput.value = "";

    if(songs.length === 1){

        loadSong(0);

    }

    alert("Lagu berhasil ditambahkan");

});

// ======================
// AUDIO EVENTS
// ======================

audio.addEventListener("play", () => {

    isPlaying = true;

});

audio.addEventListener("pause", () => {

    isPlaying = false;

});

// ======================
// INIT
// ======================

renderPlaylist();

if(songs.length > 0){

    loadSong(0);

}