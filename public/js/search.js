function set_search(user) {
    const add_contact = document.querySelector('#add_contact');
    const search_overlay = document.querySelector('#search_overlay');
    const results_block = document.querySelector('#results_block');
    const search_input = document.querySelector('#search_input');
    const link_input = document.querySelector('#link_input');
    const link_copy = document.querySelector('#link_copy');
    add_contact.addEventListener('click', () => {
        search_overlay.classList.add('active')
    })
    $(search_overlay).on('click', function (e) {
        const check1 = $(e.target).closest(results_block).length
        const check2 = $(e.target).closest(link_input).length
        const check3 = $(e.target).closest(link_copy).length
        const check4 = $(e.target).closest(search_input).length

        if (!check1 && !check2 && !check3 && !check4) {
            search_overlay.classList.remove('active')
        }
    });
    link_input.value = `https://rockpro.me/chat/${user.id}`;
    link_copy.addEventListener('click', () => {
        navigator.clipboard.writeText(link_input.value);
        link_copy.classList.add('copied');
        setTimeout(() => {
            link_copy.classList.remove('copied');
        }, 3000);
    })
    search_input.addEventListener('input', () => {
        if (!search_input.value.trim().length) {
            error();
            return false;
        }
        searching()
        $.ajax({
            type: "GET",
            url: `/api/search?search=${search_input.value}`,
            success: (results) => {
                results_block.innerHTML = '';
                if (!results.length) {
                    return error(`this user can't be found`);
                };
                results.map(res => {

                    const result_holder = document.createElement("div");
                    const result_info = document.createElement("div");
                    const result_img = document.createElement("img");
                    const result_name = document.createElement("p");
                    const result_link = document.createElement("a");
                    const name_text = document.createTextNode(res.name);


                    result_holder.setAttribute('class', 'result');
                    result_info.setAttribute('class', 'info');
                    result_img.setAttribute('src', res.avatar);
                    result_img.setAttribute('class', `circle`);
                    result_name.setAttribute('class', 'name');
                    result_link.setAttribute('class', 'add');
                    result_link.setAttribute('href', `https://rockpro.me/chat/${res.id}`);


                    results_block.appendChild(result_holder);
                    result_holder.appendChild(result_info);
                    result_holder.appendChild(result_link);
                    result_info.appendChild(result_img);
                    result_info.appendChild(result_name);
                    result_name.appendChild(name_text);

                    result_link.appendChild(document.createTextNode('Send'));


                    //      <div class="result">
                    //     <div class="info">
                    //         <img src="images/avt1.png" width="43px" class="circle">
                    //         <p class="name">name</p>
                    //     </div>
                    //     <a href="/chat" class="add">Send</a>
                    // </div> 
                })
            },
            error: (err) => {
                error(`Some error happened while searching..`);
            }
        });
    })
    function searching() {
        results_block.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin search_spin"
        style = "text-align: center; width: max-content;display:block; margin: 25px auto; font-size: 23px; color: var(--purple);" ></i >`;
    }
    function error(error = `Search for people to chat with`) {
        results_block.innerHTML = `<h3 style="text-align: center; width: 100%; margin: 40px 0;">${error}</h3>`;
    }
}