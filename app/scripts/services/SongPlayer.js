(function(){
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

    /**
    *@desc Object that stores a local copy of the album Object
    *@type {Object}
    */
    var currentAlbum = Fixtures.getAlbum();

    /**
    * @desc Buzz object that contains reference to audio
    * @type {Object}
    */
    var currentBuzzObject = null;

    SongPlayer.currentlyMuted = null;

    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song){
      if (currentBuzzObject){
        SongPlayer.stop(song);
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function(){
        $rootScope.$apply(function(){
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
    }

    /**
    *@function playSong
    *@desc Causes the currentBuzzObject to being playing audio and sets the playing value to true
    *@param {Object} song
    */
    var playSong = function(song){
      currentBuzzObject.play();
      song.playing = true;
    }

    /**
    *@function
    *@desc Returns the index value of the currently playing songs
    *@param {Object} song
    *@returns {Number}
    */
    var getSongIndex = function(song){
      return currentAlbum.songs.indexOf(song);
    };

    SongPlayer.currentSong = null;

    /**
    *@desc Current playback time (in seconds) of currently playing song
    *@type {Number}
    */
    SongPlayer.currentTime = null;

    /**
    *@desc Current volume (in percent)
    *@type {Number}
    */
    SongPlayer.volume = 100;

    /**
    *@function
    *@desc If the song set to play is not the currently playing song, it sets and plays that song. Otherwise, plays the song if it is paused
    *@param {Object} song
    */
    SongPlayer.play = function(song){
      song=song||SongPlayer.currentSong;
      if(SongPlayer.currentSong !== song){
        setSong(song);
        playSong(song);
      }
      else if(SongPlayer.currentSong === song){
        if(currentBuzzObject.isPaused()){
          playSong(song);
        }
      }
    };

    SongPlayer.stop = function(song){
      currentBuzzObject.stop();
      SongPlayer.currentSong.playing = null;
    };

    /**
    *@function
    *@desc Sets the currentBuzzObject to pause audio and sets the playing status to false
    *@param {Object} song
    */
    SongPlayer.pause = function(song){
      song=song||SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    }

    SongPlayer.previous = function(){
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        SongPlayer.stop(song);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    SongPlayer.next = function(){
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if (currentSongIndex > currentAlbum.songs.length) {
        SongPlayer.stop(song);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /**
    *@function setCurrentTime
    *@desc Set current time (in seconds) of currently playing song
    *@param {Number} time
    */
    SongPlayer.setCurrentTime = function(time){
      if (currentBuzzObject){
        currentBuzzObject.setTime(time);
      }
    };

    /**
    *@function setVolume
    *@desc Set volume of current song
    *@param {Number} volume
    */
    SongPlayer.setVolume = function(volume){
      if (currentBuzzObject){
        currentBuzzObject.setVolume(volume);
      }
    };

    SongPlayer.muteButton = function(){
      currentBuzzObject.toggleMute();
      SongPlayer.currentlyMuted = currentBuzzObject.isMuted();
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer',['$rootScope','Fixtures',SongPlayer]);
})();
