// Delay function

var delay = (time) => new Promise((resolve, reject) => {
    setTimeout(() => {
    resolve();
    }, time)
})



// Add click events to all the items in the queue

async function init(){
    let items = document.querySelectorAll('.item');
    items[1].classList.add('playing-effect-image');

    items[1].children[0].children[1].children[0].classList.add('playing-effect-songName');
    items[1].children[0].children[1].children[1].classList.add('playing-effect-movieName');

    for(let index = 0; index < items.length; index++){
        let item = items[index];
        item.setAttribute('data-index', index.toString());

        $(item).on('click', function(event) {
            let pk = $(item).data('pk');

            // make the AJAX request with the CSRF token included in the headers
            $.ajax({
                url: 'getSongData',
                type: 'POST',
                data: {
                    'pk': pk,
                },
                success: function(response) {

                    data = JSON.parse(response)[0];
                    document.querySelector('.poster').src = "/media/" + data.fields.image;
                    document.querySelector('.songName').innerHTML = data.fields.song;
                    document.querySelector('.movieName').innerHTML = data.fields.movie;
                    document.querySelector('.audio').src = "/media/" + data.fields.music;
                    document.querySelector('.lyrics').innerHTML = data.fields.lyrics.replace(/\r\n/g, "<br>");


                    audio = document.querySelector('.audio');
                    audio.setAttribute('data-pk', pk);

                    let items = document.querySelectorAll('.item');
                    for(let i = 0; i < items.length; i++){
                        items[i].classList.remove('playing-effect-gif');
                        items[i].classList.remove('playing-effect-image');

                        items[i].children[0].children[1].children[0].classList.remove('playing-effect-songName');
                        items[i].children[0].children[1].children[1].classList.remove('playing-effect-movieName');
                    }
                    item.children[0].children[1].children[0].classList.add('playing-effect-songName');
                    item.children[0].children[1].children[1].classList.add('playing-effect-movieName');

                    audio.setAttribute('data-index', item.getAttribute('data-index'));

                    pauseAndPlay();
                },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText);
                }
            });
        });
    }
}


// To get new value in new range

function getvalue(old_value, old_min, old_max, new_min, new_max){

    let new_value = ((old_value - old_min) / (old_max - old_min)) * (new_max - new_min) + new_min;

    return new_value;

}

// Format the time in MM:SS format

function format(time){
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);
    new_time = minutes + ':' + seconds;
    if(seconds < 10){
        new_time = minutes + ':0' + seconds;
    }
    return new_time;
}



// Pause and play event handler

async function pauseAndPlay(){
    let audio = document.querySelector('.audio');

    if(audio.paused == true){
        audio.play();
        document.querySelector('.play > i').classList = 'bi bi-pause-fill';

        let items = document.querySelectorAll('.item');
        currentIndex = parseInt(audio.getAttribute('data-index'));

        items[currentIndex].classList.remove('playing-effect-image');
        items[currentIndex].classList.add('playing-effect-gif');


        while(audio.paused == false){
            await delay(1000);
            let new_value = getvalue(audio.currentTime, 0, audio.duration, 0, 100);
            let bar = document.querySelector('.bar');
            bar.value = new_value;

            let startTime = document.querySelector('.startTime');
            startTime.innerHTML = format(audio.currentTime);

            let endTime = document.querySelector('.endTime');
            endTime.innerHTML = format(audio.duration);

            bar.style.background = 'linear-gradient(to right, #F32 0%, #F32 ' + bar.value + '%, #F3F3F3 ' + bar.value + '%, #F3F3F3 100%)';

        }

        if(audio.currentTime == audio.duration){
            document.querySelector('.play > i').classList = 'bi bi-play-fill';
            playPreviousOrNextSong(1);
        }
    }
    else{
        audio.pause();
        document.querySelector('.play > i').classList = 'bi bi-play-fill';

        audio = document.querySelector('.audio');
        currentIndex = parseInt(audio.getAttribute('data-index'));

        document.querySelectorAll('.item')[currentIndex].classList.remove('playing-effect-gif');
        document.querySelectorAll('.item')[currentIndex].classList.add('playing-effect-image');
    }
}



// play and pause event handling

document.querySelector('.play').addEventListener('click',pauseAndPlay)



// space bar press event handler

document.querySelector('body').addEventListener('keydown', (event) => {
    if(event.code == 'Space'){
        event.preventDefault();
        pauseAndPlay();
    }
})



// play previous or next song

function playPreviousOrNextSong(step){
    audio = document.querySelector('.audio');
    currentIndex = parseInt(audio.getAttribute('data-index'));
    items = document.querySelectorAll('.item');
    nextIndex = (currentIndex + step + items.length) % (items.length);
    items[nextIndex].dispatchEvent(new Event('click'));
}



// when previous button pressed

document.querySelector('.previous').addEventListener('click', () => {

    let icon = document.querySelector('.previous > i');
    icon.classList.add('click-effect');
    setTimeout(() => {
        icon.classList.remove('click-effect');
    }, 300);

    playPreviousOrNextSong(-1);
})


// when next button pressed

document.querySelector('.next').addEventListener('click', () => {

    let icon = document.querySelector('.next > i');
    icon.classList.add('click-effect');
    setTimeout(() => {
        icon.classList.remove('click-effect');
    }, 300);

    playPreviousOrNextSong(1);
})


// shuffle the queue

document.querySelector('.shuffle').addEventListener('click', () => {

    let icon = document.querySelector('.shuffle > i');
    icon.classList.add('click-effect');
    setTimeout(() => {
        icon.classList.remove('click-effect');
    }, 300);

    const queue = document.querySelector('.queue');
    queueArray = Array.from(queue.children);
    queueArray.forEach(item => item.remove());
    for (let i = queueArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queueArray[i], queueArray[j]] = [queueArray[j], queueArray[i]];
    }
    queue.append(...queueArray);

    audioIndex = parseInt(document.querySelector('.audio').getAttribute("data-index"));

    for(let index = 0; index < queue.children.length; index++){
        if(queue.children[index].getAttribute("data-index") == audioIndex){
            document.querySelector('.audio').setAttribute("data-index", index.toString());
        }
        queue.children[index].setAttribute("data-index", index.toString());
    }
})