(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function ajax(url, properties) {
    return new Promise(function(resolve, reject) {
        var majax = new XMLHttpRequest();

        majax.onreadystatechange = function () {
            if (majax.readyState == 4) {
                switch (majax.status) {
                    case 400:
                        reject('Bad request');
                        break;
                    case 404:
                        reject('File not found');
                        break;
                    case 500:
                        reject('Internal server error');
                        break;
                    case 503:
                        reject('Service not available');
                        break;
                    default:
                        resolve(JSON.parse(this.responseText));
                        break;
                }
            }
        };
        if(properties.hasOwnProperty('method'))
            majax.open(properties.method, url, true);
        else
            reject("Method can't be empty");
        if(properties.hasOwnProperty('headers')) {
            for(var key in properties.headers)
                majax.setRequestHeader(key, properties.headers[key]);
        }
        if(properties.hasOwnProperty('data') && properties.method.toUpperCase() === 'POST')
            majax.send(properties.data);
        else
            majax.send();
    });
}

module.exports = {
    ajax: ajax
};
},{}],2:[function(require,module,exports){
function isValid(element) {
    return element.name && element.value;
};

function formToJSON(elements) {
    return [].reduce.call(elements, function(data, element) {
        if(isValid(element))
            data[element.name] = parseInt(element.value) ? parseInt(element.value) : element.value.toString();
        return data;
    }, {});
};

module.exports = {
    formToJSON: formToJSON,
    isValid: isValid
}
},{}],3:[function(require,module,exports){
var m = require('./ajax.js'),
    utility = require('./utility_functions.js');

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementsByClassName('form-styling')[0].querySelector('form'),
        album_shows = document.getElementsByClassName('albums_show')[0];

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var formToken = utility.formToJSON(this.elements);
        m.ajax('http://localhost:3000/return_album', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(formToken)
        })
            .then(function (res) {
                if(res.success === true) {
                    var album = res.data;
                    album_shows.style.display = 'flex';
                    album_shows.innerHTML = '<h1>' + album.album_name + '</h1>' +
                        '<div id="carousel1">'+
                        '<div>' +
                        '</div>' +
                        '</div>';
                    var carousel_kid = document.getElementById('carousel1').children[0];
                    for(var i = 0; i < album.images.length; i++) {
                        carousel_kid.innerHTML = carousel_kid.innerHTML + '<div class="member">' +
                            '<img src="' + album.images[i] + '" /></div>';
                    }
                    init('carousel1', {
                        type: album.type,
                        items: album.items,
                        transition: {
                            transitionType: album.transition_type,
                            transitionItems: album.transition_items,
                            auto: album.auto
                        }
                    });
                }
            })
            .catch(function (err) {
                if (err) console.warn(err);
            });
    });
});
},{"./ajax.js":1,"./utility_functions.js":2}]},{},[3]);