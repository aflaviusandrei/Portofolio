var m = require('./ajax.js');
var utility = require('./utility_functions.js');


document.addEventListener('DOMContentLoaded', function(e) {
    var form = document.getElementsByClassName('form-styling')[0];
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = utility.formToJSON(this.elements);
        console.log(data);
        m.ajax('http://localhost:3000/create_album', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        })
            .then(function (res) {
                console.log(res);
            })
            .catch(function (err) {
                if (err) console.warn(err);
            });
    });
});