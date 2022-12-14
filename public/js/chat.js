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
        success: (result) => {
            set_data(result.data.contacts)
            set_search(result.data.user)
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
function set_data(contacts) {
    refresh_contacts();
    function refresh_contacts() {
        // contacts_box.innerHTML = ''
        if (!contacts.length) return;
        contacts.sort((a, b) => {
            return b.last_msg.createdOn - a.last_msg.createdOn;
        }).map(contact => {
            const last_msg = contact.last_msg.message ? contact.last_msg.message : 'New contact';

            const contact_holder = document.createElement("a");

            const contact_img = document.createElement("img");
            const contact_info = document.createElement("div");
            const contact_name = document.createElement("p");
            const contact_last_msg = document.createElement("p");
            const contact_name_text = document.createTextNode(contact.name);
            const contact_last_msg_text = document.createTextNode(last_msg);

            contacts_box.appendChild(contact_holder);
            contact_holder.appendChild(contact_img);
            contact_holder.appendChild(contact_info);
            contact_info.appendChild(contact_name);
            contact_info.appendChild(contact_last_msg);
            contact_name.appendChild(contact_name_text);
            contact_last_msg.appendChild(contact_last_msg_text);
            contact_holder.setAttribute('href', `/chat/${contact.id}`);
            contact_holder.setAttribute('class', 'contact curved pointer transition');
            contact_img.setAttribute('class', 'contact_avatar circle');
            contact_img.setAttribute('src', contact.avatar);
            contact_info.setAttribute('class', 'contact_info');
            contact_name.setAttribute('class', 'contact_name');
            contact_last_msg.setAttribute('class', 'last_msg');
        })
    }

    socket.on('message', data => {
        send_sfx('message');
        let contact = contacts.find(contact => contact.id == data.by.id);
        if (contact) {
            contact.last_msg = data;
            refresh_contacts();
        }
        else {
            contacts.push({
                id: data.by.id,
                name: data.by.name,
                avatar: data.by.avt,
                last_msg: data,
            })
            refresh_contacts();
        }
    })
    socket.on('my_message', data => {
        let contact = contacts.find(contact => contact.id == data.to.id);
        if (contact) {
            contact.last_msg = data;
            refresh_contacts();
        }
        else {
            contacts.push({
                id: data.to.id,
                name: data.to.name,
                avatar: data.to.avt,
                last_msg: data,
            })
            refresh_contacts();
        }
    })
}


function set_chat(data) {
    const header_info = document.createElement("div");
    const header_img = document.createElement("img");
    const header_name = document.createElement("p");
    const header_name_text = document.createTextNode(data.user2.name);

    header_img.setAttribute('src', data.user2.avatar)
    header_info.classList.add('info')
    header_img.classList.add('avatar')
    header_img.classList.add('circle')
    header_name.classList.add('name')
    chat_header.appendChild(header_info)
    header_info.appendChild(header_img)
    header_info.appendChild(header_name)
    header_name.appendChild(header_name_text)

    const messages = data.messages
    for (let i = 0; i < messages.length; i++) {
        const msg_obj = document.createElement("div");
        const msg_text_holder = document.createElement("p");
        const msg_text = document.createTextNode(messages[i].message);
        if (messages[i].by == id) {
            const msg_avt = document.createElement("img");
            msg_avt.setAttribute('class', 'msg_avt circle');
            msg_avt.setAttribute('src', data.user2.avatar)
            msg_obj.appendChild(msg_avt);
            if (messages[i - 1])
            {
                if (messages[i - 1].by == id) msg_obj.classList.add('up')
            }
            if (messages[i + 1])
            {
                if (messages[i + 1].by == id) msg_obj.classList.add('down-avt')
            }
        }
        else {
            msg_obj.classList.add('me')
            if (messages[i - 1])
            {
                if (messages[i - 1].by != id) msg_obj.classList.add('up')
            }
            if (messages[i + 1])
            {
                if (messages[i + 1].by != id) msg_obj.classList.add('down')
            }

        }
        chat_box.appendChild(msg_obj);

        msg_obj.appendChild(msg_text_holder)
        msg_text_holder.appendChild(msg_text);

        msg_text_holder.classList.add('msg_text')
        msg_obj.classList.add('msg')
        
    }
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
    if (data.to.id != id || data.current == true) return
    create(data.message);
});
socket.on('message', data => {
    if (data.by.id != id) return
    get(data.message, data.by.avt);
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
    msg_obj.setAttribute('class', 'msg me')
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
    msg_avt.setAttribute('class', 'circle msg_avt')
    msg_avt.setAttribute('src', avt)
    msg_text_holder.classList.add('msg_text')
    msg_obj.classList.add('msg')

    chat_box.scrollTop = chat_box.scrollHeight;
    msg_input.focus();
    socket.emit('remove_typing', { to: id })
}

function set_typing(avt = '') {
}

function remove_typing() {
}
