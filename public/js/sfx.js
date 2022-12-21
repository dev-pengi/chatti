let first_click = false; // some browsers requires the user to at least click onetime to allow the website to use audios...
document.addEventListener('click', () => {
    console.log(first_click);
    if (!first_click) return first_click = true;
})

const sfx_player = document.querySelector('#general_sfx');
const sfx = {
    message: {
        path: '../audios/message.wav',
        loop: false,
    },
};

function send_sfx(type) {
    if (!type || !first_click) return false;
    const play_type = sfx[type];
    if (!play_type) return false;

    sfx_player.src = play_type.path;
    sfx_player.load();
    sfx_player.play();
}