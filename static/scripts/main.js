'use strict';

$(document).ready(function () {

    // Smooth scrolling
    $('a[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

});

(function () {
    var files = Array();
    var queue = Array();

    $(window).bind('beforeunload', function () {
        if (queue.length === 0) {
            return;
        }

        return 'There are still ' + queue.length + ' files being uploaded.';
    });

    function upload(file) {
        $('.browse').addClass('uploading');

        var li = $('<li style="clear:both;"/>');

        li.append($('<div><div class="upload-progress"><span></span><div class="bar" style="width:0%;">####################################################</div></div><p>Uploading... ' + file.name + '</p></div>'));
        $(li).appendTo($('.queue'));

        var xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', function (e) {
            var pc = parseInt((e.loaded / e.total * 100));
            $('.upload-progress', $(li)).show();
            $('.upload-progress .bar', $(li)).css('width', pc + '%');
            $('.upload-progress span  ', $(li)).empty().append(pc + '%');

        }, false);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                /*            $('.upload-progress', $(li)).hide();*/
                $('#web').addClass('uploading');
                // progress.className = (xhr.status == 200 ? "success" : "failure");
                if (xhr.status === 200) {
                    $(li).html('<a target="_blank" href="' + xhr.responseText + '">' + xhr.responseText + '</a>');
                } else {
                    $(li).html('<span>Error (' + xhr.status + ') during upload of file ' + file.name + '</span>');
                }

                // file uploaded successfully, remove from queue
                var index = queue.indexOf(xhr);
                if (index > -1) {
                    queue.splice(index, 1);
                }

                files.push(URI(xhr.responseText.replace('\n', '')).path());

                // $('.download-zip').attr('href', URI('(' + files.join(',') + ').zip').absoluteTo(location.href).toString());
                // $('.download-tar').attr('href', URI('(' + files.join(',') + ').tar.gz').absoluteTo(location.href).toString());

                $('.all-files').addClass('show');
            }
        };

        // should queue all uploads.
        queue.push(xhr);

        var form_data = new FormData();
        form_data.append('file', file);

        $.ajax({
            type: 'PUT',
            url: '/',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                console.log('Success!');
                $(li).html('<a target="_blank" href="' + data + '">' + data + '</a>');
            },
            error: function (err) {
                console.error(err);
                $(li).html('<span>Error (' + err + ') during upload of file ' + file.name + '</span>');
            }
        });
        console.log(file);

        // start upload
        // xhr.open('POST', '/' , true);
        //
        // xhr.send(file);
    }

    $(document).bind('dragenter', function (event) {
        event.preventDefault();
    }).bind('dragover', function (event) {
        event.preventDefault();
        // show drop indicator
        $('#terminal').addClass('dragged');
        $('#web').addClass('dragged');
    }).bind('dragleave', function () {
        $('#terminal').removeClass('dragged');
        $('#web').removeClass('dragged');

    }).bind('drop dragdrop', function (event) {
        var files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files;

        $.each(files, function (index, file) {
            upload(file);
        });

        event.stopPropagation();
        event.preventDefault();
    });

    $('a.browse').on('click', function () {
        $('input[type=file]').click();
        return (false);
    });


    $('input[type=file]').on('change', function () {
        $.each(this.files, function (index, file) {
            if (file instanceof Blob) {
                upload(file);
            }
        });
    });

    // clipboard
    if (window.location.href.indexOf('download') > -1) {


        (function () {
            var copylinkbtn = document.getElementById('copy-link-btn'),
                copylink = document.getElementById('copy-link-wrapper'),
                overlay = document.getElementById('overlay');

            var url = 'http://url';
            copylinkbtn.addEventListener('click', function () {

                var error = document.getElementsByClassName('error');

                while (error[0]) {
                    error[0].parentNode.removeChild(error[0]);
                }

                document.body.className += ' active';

                copylink.children[1].value = url;
                copylink.children[1].focus();
                copylink.children[1].select();
            }, false);

            overlay.addEventListener('click', function () {
                document.body.className = '';
            }, false);

            copylink.children[1].addEventListener('keydown', function (e) {

                var error = document.getElementsByClassName('error');

                while (error[0]) {
                    error[0].parentNode.removeChild(error[0]);
                }

                setTimeout(function () {

                    if ((e.metaKey || e.ctrlKey) && e.keyCode === 67 && isTextSelected(copylink.children[2])) {
                        document.body.className = '';
                    } else if ((e.metaKey || e.ctrlKey) && e.keyCode === 67 && isTextSelected(copylink.children[2]) === false) {
                        var error = document.createElement('span');
                        error.className = 'error';
                        var errortext = document.createTextNode('The link was not copied, make sure the entire text is selected.');

                        error.appendChild(errortext);
                        copylink.appendChild(error);
                    }
                }, 100);

                function isTextSelected(input) {
                    if (typeof input.selectionStart === 'number') {
                        return input.selectionStart === 0 && input.selectionEnd === input.value.length;
                    } else if (typeof document.selection !== 'undefined') {
                        input.focus();
                        return document.selection.createRange().text === input.value;
                    }
                }
            }, false);
        })();
    }

})();


/***
 * clipboard
 ***/

// (function () {
//     var copylinkbtn = document.getElementById("copy-link-btn"),
//         copylink = document.getElementById("copy-link-wrapper"),
//         overlay = document.getElementById("overlay");
//
//     var url = "http://url"
//     copylinkbtn.addEventListener("click", function (e) {
//         e.preventDefault();
//
//         var error = document.getElementsByClassName('error');
//
//         while (error[0]) {
//             error[0].parentNode.removeChild(error[0]);
//         }
//
//         document.body.className += ' active';
//
//         copylink.children[1].value = url;
//         copylink.children[1].focus();
//         copylink.children[1].select();
//         return (false);
//     }, false);
//
//     overlay.addEventListener("click", function (e) {
//         e.preventDefault();
//         document.body.className = '';
//         return (false);
//     }, false);
//
//     copylink.children[2].addEventListener("keydown", function (e) {
//
//         var error = document.getElementsByClassName('error');
//
//         while (error[0]) {
//             error[0].parentNode.removeChild(error[0]);
//         }
//
//         setTimeout(function () {
//
//             if ((e.metaKey || e.ctrlKey) && e.keyCode === 67 && isTextSelected(copylink.children[2])) {
//                 document.body.className = '';
//             } else if ((e.metaKey || e.ctrlKey) && e.keyCode === 67 && isTextSelected(copylink.children[2]) === false) {
//                 var error = document.createElement('span');
//                 error.className = 'error';
//                 var errortext = document.createTextNode('The link was not copied, make sure the entire text is selected.');
//
//                 error.appendChild(errortext);
//                 copylink.appendChild(error);
//             }
//         }, 100);
//
//         function isTextSelected(input) {
//             if (typeof input.selectionStart == "number") {
//                 return input.selectionStart == 0 && input.selectionEnd == input.value.length;
//             } else if (typeof document.selection != "undefined") {
//                 input.focus();
//                 return document.selection.createRange().text == input.value;
//             }
//         }
//     }, false);
// })();


/***
 * main bk
 */
/*
$(document).ready(function () {

    // Terminal typing animation
    $("#from-terminal p").typed({
        strings: ["curl --upload-file ./hello.txt {{.WebAddress}}hello.txt\n{{.WebAddress}}66nb8/hello.txt \n "],
        typeSpeed: 0,
        loop: true,
    });

    // Smooth scrolling
    $('a[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});
*/