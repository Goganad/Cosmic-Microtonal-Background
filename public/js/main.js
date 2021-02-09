$(function(){
    var audio = $('audio');

    function loadSongs(){
        $.ajax({
            url: '/songs'
        }).done(function(songs){
            var list = $('.song-list');
            list.empty();
            songs.forEach(function(song){
                var newElement = $('<li class="song">'+song.name+'</li>');
                newElement.on('click', song, play)
                newElement.appendTo(list);
            })
        }).fail(function(){
            alert('Can\'t load songs');
        })
    }

    function play(event){
        audio[0].pause();
        audio.attr('src', '/songs/' + event.data.name);
        audio[0].play();
    }

    loadSongs();
});