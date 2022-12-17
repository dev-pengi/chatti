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
            window.location.path = '/chat'
        }
    });
    if (!id) return;
    $.ajax({
        type: "GET",
        url: `/api/user/contact/${id}`,
        success: (data) => {
            set_chat(data)
        },
        error: (err) => {
            window.location.path = '/chat'
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
    if (!msg_input.value.trim().length) {
        send_btn.classList.add('off');
        socket.emit('remove_typing', { to: id })
    }
    else {
        send_btn.classList.remove('off');
        socket.emit('typing', { to: id })
    }
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

socket.on('my_message', data => {
    create(data.message);
});
socket.on('message', data => {
    get(data.message, data.avt);
});
socket.on('typing', data => {
    set_typing(data.avt);
});
socket.on('remove_typing', data => {
    remove_typing();
});

function create(msg = '') {
    if (!msg.trim().length) return false;
    const msg_obj = document.createElement("div");
    const msg_text_holder = document.createElement("p");
    const msg_text = document.createTextNode(msg);
    msg_obj.appendChild(msg_text_holder)
    msg_text_holder.appendChild(msg_text);
    msg_text_holder.classList.add('msg_text')
    msg_obj.classList.add('msg')
    msg_obj.classList.add('me')
    chat_box.appendChild(msg_obj);

    chat_box.scrollTop = chat_box.scrollHeight;
    msg_input.value = '';
    msg_input.focus();
    send_btn.classList.add('off')
}

function send(msg = '') {
    create(msg);
    socket.emit('messages', {
        action: 'post',
        type: 'text',
        to: id,
        content: msg
    }, (response) => {
    })
}

function get(msg = '', avt = '') {
    if (!msg.trim().length) return false;
    const msg_obj = document.createElement("div");
    const msg_avt = document.createElement("img");
    const msg_text_holder = document.createElement("p");
    const msg_text = document.createTextNode(msg);
    msg_obj.appendChild(msg_avt)
    msg_obj.appendChild(msg_text_holder)
    msg_text_holder.appendChild(msg_text);
    chat_box.appendChild(msg_obj);
    msg_avt.classList.add('msg_avt')
    msg_avt.classList.add('circle')
    msg_avt.width = '32px'
    msg_avt.src = avt
    msg_text_holder.classList.add('msg_text')
    msg_obj.classList.add('msg')
    // console.log(avt);

    chat_box.scrollTop = chat_box.scrollHeight;
    msg_input.focus();
    socket.emit('remove_typing', { to: id })
}



function set_typing(avt = '') {
    // chat_box.append('hiii')
    const typing_box = document.querySelector('#typing_box');
}
function remove_typing() {
}

// setInterval(() => {
//          get('hi')
//  }, 1000);