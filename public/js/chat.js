const contacts_box = document.querySelector('#contacts_box');

const msg_input = document.querySelector('#msg_input');
const main = document.querySelector('main');
const chat_header = document.querySelector('#chat_header');
const send_btn = document.querySelector('#send_btn');
const chat_box = document.querySelector('#chat_box');
var id = window.location.pathname.split('/')[2];

get_contacts()
function get_contacts() {
    $.ajax({
        type: "GET",
        url: `/api/user/contacts`,
        success: (data) => {
            set_data(data.data)
        },
        error: (err) => {
        }
    });
    if (!id) return main.innerHTML = `<h3 style="display:block; text-align:center; margin:50vh auto; font-size:1.3rem; color:var(--dark);">Select a chat or start a new conversation</h3>`
    $.ajax({
        type: "GET",
        url: `/api/user/contact/${id}`,
        success: (data) => {
            set_chat(data)
        },
        error: (err) => {
            main.innerHTML = `<h3 style="display:block; text-align:center; margin:50vh auto; font-size:1.3rem; color:var(--dark);">Select a chat or start a new conversation</h3>`
        }
    });
}
function set_data(res) {
    const html = res.map(contact => {
        return `
        <a href="/chat/${contact.id}"class="contact pointer transition curved">
            <img crossorigin="anonymous"  src="${contact.avatar}" class="contact_avatar circle" width="50px">
            <div class="contact_info">
                <p class="contact_name">${contact.name}</p>
                <p class="last_msg">new contact</p>
            </div>
        </a>`
    }).join('')
    contacts_box.innerHTML = html
}





function set_chat(data) {

    console.log(data);
    const header = () => {
        return `<div class="info">
            <img crossorigin="anonymous" src="${data.user2.avatar}" class="avatar circle" width="40px">
                <p class="name">${data.user2.name}</p>
        </div>`
    }
    chat_header.innerHTML = header();
    const messages = data.messages.map(message => {
        const avatar = () => {
            if (message.by == id) return `<img crossorigin="anonymous" src="${data.user2.avatar}" class="msg_avt circle" width="32px">`
            return '';
        }
        const by = () => {
            if (message.by != id) return 'me'
            return '';
        }
        return `
        <div class="msg ${by()}">
            ${avatar()}
            <p class="msg_text">${message.message}</p>
        </div>
        `
    }).join('')
    chat_box.innerHTML = messages;
    chat_box.scrollTop = chat_box.scrollHeight;
}


msg_input.addEventListener('input', () => {
    if (!msg_input.value.trim().length) return send_btn.classList.add('off');
    send_btn.classList.remove('off');
})
send_btn.addEventListener('click', () => {
    let msg = msg_input.value;
    send(msg);
})
window.addEventListener("keyup", function (event) {
    if (event.keyCode != 13) return;
    let msg = msg_input.value;
    send(msg);
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


    socket.emit('messages', {
        action: 'post',
        type: 'text',
        to: id,
        content: msg
    })

    // $.ajax({
    //     type: "POST",
    //     url: `/api/user/chat/${id}/messages/send`,
    //     data: data,
    //     success: (data) => {
    //         console.log(`took ${Date.now() - start_t}ms to send.`);
    //     },
    //     error: (err) => {
    //         console.log(err);
    //     }
    // });

}
function get(msg = '', avt = 'images/avt1.png') {
    if (!msg.trim().length) return false;
    chat_box.innerHTML += `
    <div class="msg">
        <img src="${avt}" crossorigin="anonymous" class="msg_avt circle" width="32px">
        <p class="msg_text">${msg}</p>
    </div>`
    chat_box.scrollTop = chat_box.scrollHeight;
    msg_input.focus();
}

// setInterval(() => {
//          get('hi')
//  }, 1000);