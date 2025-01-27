console.log('Hello World')
let playingsong = new Audio();
let playing = document.getElementById("player")
let prev = document.getElementById("prev")
let next= document.getElementById("next")
let imageSrc=playing.querySelector("img")
let songs

function formatTime(seconds) {

      if(isNaN(seconds) || seconds<0)
      {
            return "invalid input"
      }
      const minutes = Math.floor(seconds / 60); // Calculate minutes
      const remainingSeconds = Math.floor(seconds % 60);  // Calculate remaining seconds
  
      // Format seconds to always show two digits (e.g., 05 instead of 5)

      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
      return `${formattedMinutes}:${formattedSeconds}`;
  }

async function getSongs() {

      try {
            let a = await fetch("http://127.0.0.1:5500/songs/");
            let response = await a.text();
            console.log(response)
            let div = document.createElement("div")
            div.innerHTML = response;
            let as = div.getElementsByTagName("a")
            console.log(as)
            let songs = []
            for (let index = 0; index < as.length; index++) {
                  const element = as[index];
                  if (element.href.endsWith(".mp3"))
                        songs.push(element.href.split("/songs/")[1])
            }
            return songs
      } catch (error) {
            console.error("Error fetching songs:", error);
            return [];
      }


}

playmusic = (music) => {
      playingsong.src = "/songs/" + music
      playingsong.play()
      imageSrc.src="pause-for-playbar.svg"

      document.querySelector(".playbar-text").innerHTML=music
}

async function main() {
      songs = await getSongs();
      console.log(songs)

      let ulsong = document.querySelector(".songs-list").getElementsByTagName("ul")[0]
      for (const song of songs) {

            ulsong.innerHTML = ulsong.innerHTML + `<li class="d-flex align-center justify-content-between border border-secondary ps-3  pe-3 rounded-3 ">
                                                <div class="songs-info d-flex text-light fw-bold  align-center gap-5">
                                                      <img class="invert cursor-pointer" src="music.svg" alt="Music">
                                                      <div class="eachSong">${song.replaceAll("%20", " ")}</div>
                                                </div>
                                                <img class="playbar-btn cursor-pointer" src="pause.svg" alt="">
                                          </li>` ;
      }

      //1

      Array.from(document.querySelector(".songs-list").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                  let a = (e.querySelector(".songs-info").getElementsByClassName("eachSong")[0])
                  playmusic(a.innerHTML.trim())
                  // playbarCall()
            })
      })

      //2

      playing.addEventListener("click", () => {
            playing.src = "pause-for-playbar.svg"
            if (playingsong.paused) {
                  playingsong.play()
                  imageSrc.src = "pause-for-playbar.svg"
            } else {
                  playingsong.pause()
                  imageSrc.src = "play-for-playbar.svg"
            }
      })

      //3

      playingsong.addEventListener("timeupdate", () => {
            if (!isNaN(playingsong.duration)) {
                document.querySelector(".timestamp").innerHTML = 
                    `${formatTime(playingsong.currentTime)}/${formatTime(playingsong.duration)}`;
            }

            document.querySelector(".circle").style.left=(playingsong.currentTime/playingsong.duration)*100 + "%"
        });


        document.querySelector(".seekbar").addEventListener("click",e=>{
            let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
            document.querySelector(".circle").style.left=percent+"%"
            playingsong.currentTime=((playingsong.duration)*percent)/100
        })

        document.querySelector(".hamburger").addEventListener("click",()=>{
            document.querySelector(".left").style.left="0"
        })
        document.querySelector(".cross").addEventListener("click",()=>{
            document.querySelector(".left").style.left="-100%"
        })

        document.querySelector(".btn-play").addEventListener("click",()=>{

            imageSrc.src="play.svg"
            Array.from(document.querySelector(".songs-list").getElementsByTagName("li")).forEach(e => {
                        let a = (e.querySelector(".songs-info").getElementsByClassName("eachSong")[0])
                        playmusic(a.innerHTML.trim())
                        // playbarCall()
                  })
            })

            prev.addEventListener("click",()=>{

                  let index=songs.indexOf(playingsong.src.split("/").slice(-1)[0])
                  if(index+1>= 0){
                        playmusic(songs[index-1])
                  }
            })
            next.addEventListener("click",()=>{

                  playingsong.pause()
                  let index=songs.indexOf(playingsong.src.split("/").slice(-1)[0])
                  if(index+1<songs.length){
                        playmusic(songs[index+1])
                  }
            })

            
        
        
}


// }
main()

