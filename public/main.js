$(function () {
    let $window = $(window);
    let $userNameInput = $('.userNameInput');
    let $userNames = $('.usernames');

    let $loginPage = $('.login.page');
    let $userNamePage = $('.username.page');
    $userNamePage.hide();

    let username;
    let connected = false;

    let $currentInput = $userNameInput.focus();

    let socket = io();

    const setUserName = () => {
        username = cleanInput($userNameInput.val().trim());

        if (username) {
            $loginPage.fadeOut();
            $userNamePage.fadeIn();
            $loginPage.off('click');

            socket.emit('add user', username);
        }
    }

    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    }

    $window.keydown(event => {
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }

        if (event.which === 13) { // User hits enter
            setUserName();
        }

    });

    socket.on('login', (data) => {
        console.log('someone has joined');
        if (connected) {
            return;
        } else {
            connected = true;
            console.log(data.users);
            if (data.users.length > 0) {
                for (let user of data.users) {
                    let $el = $(`<li>`).text(user);    
                    $el.prop('id', user.username);
                    $userNames.append($el);
                }
            }
        }

    });

    socket.on('added', (data) => {
        let $el = $('<li>').text(data.username);
        $el.prop('id', data.username);
        console.log($el);
        $userNames.append($el);
    });

    socket.on('user left', (data) => {
        let elSelector =`#${data.username}`; 
        $(elSelector).remove();
    });

});