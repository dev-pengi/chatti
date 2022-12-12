const msg_input = document.querySelector('#msg_input');
const send_btn = document.querySelector('#send_btn');
const chat_box = document.querySelector('#chat_box');
chat_box.scrollTop = chat_box.scrollHeight;

msg_input.addEventListener('input', () => {
    if (!msg_input.value.trim().length) return send_btn.classList.add('off');
    send_btn.classList.remove('off');
})

send_btn.addEventListener('click', () => {
    let msg = msg_input.value;
    send(msg);
})

window.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        let msg = msg_input.value;
        send(msg);
    }
});
 
function send(msg = '') {
    if (!msg.trim().length) return false;
    chat_box.innerHTML += `
    <div class="msg me">
        <p class="msg_text">${msg}</p>
    </div>`
    chat_box.scrollTop = chat_box.scrollHeight;
    msg_input.value = '';
    msg_input.focus();
    send_btn.classList.add('off')
}