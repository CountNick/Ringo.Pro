console.log('This is musicplayer speaking')
console.log('token: ', token)

let pauseButton = document.querySelector('.pauseButton')
let previousButton = document.querySelector('.previousButton')
let nextButton = document.querySelector('.nextButton')
let albumArt = document.querySelector('.album-art')
let nowPlaying = document.querySelector('.nowPlaying')
let trackProgression = document.querySelector('.progress')
let volume = document.querySelector('.volume')

window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
        name: 'Ringo Pro player',
        getOAuthToken: cb => {cb(token)}
    })

      // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    
    player.getCurrentState().then(state => {
        if(!state){
            nowPlaying.textContent = 'Click on a song!'
            // console.error('User is not playing music through the Web Playback SDK')
            return
        }

        let {
            current_track,
            next_tracks: [next_track]
        } = state.track_window

        console.log('Currently Playing', current_track);
        console.log('Playing Next', next_track);


    })
    
    // setInterval(function(){  }, 1000);

    // Playback status updates
    
    // player.addListener('player_state_changed', ({
    //     paused,
    //     position,
    //     duration,
    //     updateTime = performance.now(),
    //     track_window: {current_track}
        
    // }) => {
            

    //         // console.log('Currnetly Playing: ', current_track)

    //         nowPlaying.textContent = `${current_track.name} - ${current_track.artists[0].name}`
    //         albumArt.src = current_track.album.images[1].url
            
     
    //         trackProgression.max = duration
    //         trackProgression.value = position

    //         // if(paused === true){
    //         //     trackProgression.value = position
    //         // }

    //         //     setInterval(() => {
  
    //         //         position = position + (performance.now() - updateTime) / 1000;
    //         //         // trackProgression.value = position
    //         //         console.log(position)
    
    //         //     }, 5000);
 
    //             // function getStatePosition() {
    //             //     if (paused) {
    //             //        return position;
    //             //     }
    //             //     else{
    //             //     position = position + (performance.now() - updateTime) / 1000;
    //             //     return position > duration ? duration : position;}
    //             // }  
    // });

    let currState = {}
player.addListener('player_state_changed', state => {
  currState.paused = state.paused;
  currState.position = state.position;
  currState.duration = state.duration;
  currState.updateTime = performance.now()
//   console.log(state)
  currState.current_track = state.track_window.current_track
});

// if(currState.duration) trackProgression.max = currState.duration


function getStatePosition() {
    // trackProgression.max = currState.duration 
    nowPlaying.textContent = `${currState.current_track.name} - ${currState.current_track.artists[0].name}`
    albumArt.src = currState.current_track.album.images[1].url
  if (currState.paused === true) {
     return currState.position;
  }
trackProgression.max = currState.duration
  let position = currState.position + (performance.now() - currState.updateTime) / 1000;
  return position > currState.duration ? currState.duration : position;
}

setInterval(() => {
    // currState.current_track.duration
    // if(Object.keys(currState).length > 0 && currState.constructor === Object)
    if(typeof getStatePosition() !== NaN){
        console.log(getStatePosition())
        // trackProgression.stepUp()
        trackProgression.setAttribute('value', getStatePosition().toString())
        
        if(currState.paused === false){
        trackProgression.stepUp(1000)}

        
        // trackProgression.style.WebkitTransition = 'transition: width .1s'
        // trackProgression.max = currState.duration
        // console.log('hallo: ', Math.floor((getStatePosition() / currState.duration) * 100))

    }
}, 1000);


    volume.addEventListener('mouseup', function(){

        player.setVolume(this.value).then(() => {
            console.log('volume updated to: ', this.value)
        })
    })
    
    pauseButton.addEventListener('click', (event) => {
        event.target.classList.toggle("paused")
        player.togglePlay().then(() => {
            
        })
    })

    previousButton.addEventListener('click', () => {
        	
        player.previousTrack().then(() => {
            console.log('Set to previous track!');
        });
    })

    nextButton.addEventListener('click', () => {
        	
        player.nextTrack().then(() => {
            console.log('Set to next track!');
        });
    })

    trackProgression.addEventListener('mouseup', function(){
        console.log('yeet: ', this.value)
        player.seek(this.value).then(() => {
            console.log('Changed position!');
        })
    })
    
    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);



        const play = async({
            spotify_uri,
            playerInstance: {
                _options: {
                    getOAuthToken,
                    id
                }
            }
        }) => {

            getOAuthToken(access_token => {
                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({uris: [spotify_uri]}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    }
                })
            })
        }
        function start(){
            // console.log(this.id)
            trackProgression.stepDown(trackProgression.value)
            return play({
                playerInstance: player,
                spotify_uri: this.id,
            })
        }

        const observer = new MutationObserver(function(mutations) {

            mutations.forEach(function(mutation) {
              if(mutation){
                  console.log(mutation)
                  const playButtonList = document.querySelectorAll('.playButton')
                  console.log(playButtonList)

                  playButtonList.forEach((playButton) => {
                    // console.log(playButton)
                
                    // playButton.addEventListener('click', event => {
                    //     pauseButton.classList.add('paused')
                    //     console.log(event.target.id)
        
                    //     return play({
                    //         playerInstance: player,
                    //         spotify_uri: event.target.id,
                    //     })
                    //     // console.log(event.target.id)
                    // })
                    playButton.addEventListener('click', start)
                    // playButton.removeEventListener('click', start)

                })
              }
            })
        })
        
        const results = document.querySelectorAll('.search-results')
        
        
        console.log(results)
        
        observer.observe(results[0], {
            childList: true,
            attributes: true,
            characterData: true,
        
        })
    


    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });
    console.log('player: ', player)
    // Connect to the player!
    player.connect();

}

