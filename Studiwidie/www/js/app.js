// Variable Initialization
var username = '';
var password = '';
var logged_in = window.localStorage["logged_in"];
var post_url = '';
var id_mapel = '';
var ujian_mapel = '';
var ujian_seri = '';
var ujian_nomor = 0;
var jumlah_soal = 0;
//var api_url = 'http://api.studiwidie.com'; // Production
var api_url = 'http://api.studiwidie.app'; // Development

$( document ).on( "mobileinit", function() {
    console.log("Studiwidie initialization is started.");
    $.mobile.loader.prototype.options.text = "Menghubungkan Jaringan...";
    $.mobile.loader.prototype.options.textVisible = true;
    $.mobile.loader.prototype.options.theme = "b";
    $.mobile.loader.prototype.options.html = "";

    $(document).bind('keydown', function(event) {   
        if (event.keyCode == 27) { // 27 = 'Escape' keyCode (back button)
                event.preventDefault();
            }
    });

    initialization();
    console.log("Studiwidie initialization is ended.");
});

function initialization() {
    var post_url = "/login";
	username = window.localStorage["username"];
	password = window.localStorage["password"];

	console.log("Login check with saved username & password in the localStorage.");

	$.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            username: username, 
            password: password,
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in == true) {
                console.log("Login berhasil, username & password localStorage benar.");

                set_nama(obj.nama);

                setTimeout(function (){
                    location.hash = "home-page";
                }, 2000);
            } else {
                console.log("Login gagal, username & password di localStorage salah.");

                setTimeout(function (){
                    location.hash = "public-page";
                }, 2000);
            }
        },
        error: function(xhr, textStatus, errorThrown){
            console.log("Network error");
            location.hash = "network-error";
        }
    });
} 

function ExitApp() {
    navigator.app.exitApp();
}

$( document ).on( "vclick", "#exitApp", function() {
    console.log("Exiting applications.");
    ExitApp();
});

function network_error() {
    console.log("Network error");
    location.hash = "network-error";
}

function set_nama( nama ) {
    $( '#home-nama' ).html( nama );
    $( '#belajar-nama' ).html( nama );
    $( '#belajar_materi-nama' ).html( nama );
    $( '#materi-nama' ).html( nama );
    $( '#ujian-nama' ).html( nama );
    $( '#start_ujian-nama' ).html( nama );
    $( '#progress-nama' ).html( nama );
}

function reset_all_input () {
    $( "#login-username" ).val('');
    $( "#login-password" ).val('');
}

// Logout
$( document ).on( "vclick", "#logout", function() {
    $.mobile.loading( "show" );

    post_url = "/login/logout";

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            request: "logout"
        },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in == false) {
                console.log("Logout berhasil.");

                $('#home-notif').html(obj.notification);
                $('#home-popup').popup('open');

                window.localStorage["username"] = '';
                window.localStorage["password"] = '';

                setTimeout(function (){
                    location.hash = "public-page";
                }, 2000);
                
            } else {
                $.mobile.loading( "hide" );

                $('#home-notif').html(obj.notification);
                $('#home-popup').popup('open');

                console.log("Logout gagal, server mengalami masalah.");
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});    

// --------------------------------- Start Login Page ---------------------------------

$( document ).on( "vclick", "#login-button", function() {
    $.mobile.loading( "show" );

    post_url = "/login";
    username = $( "#login-username" ).val();
    password = $( "#login-password" ).val();

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            username: username, 
            password: password,
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in == true) {
                console.log("Login berhasil, username & password disimpan ke localStorage.");

                $('#login-notif').html(obj.notification);
                $('#login-popup').popup('open');

                window.localStorage["username"] = username;
                window.localStorage["password"] = password;

                set_nama(obj.nama);
                reset_all_input();

                setTimeout(function (){
                    location.hash = "home-page";
                }, 2000);
                
            } else {
                $.mobile.loading( "hide" );

                $('#login-notif').html(obj.notification);
                $('#login-popup').popup('open');

                console.log("Login gagal, username & password salah.");
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});

$( document ).on( "vclick", "#register-button", function() {
    $.mobile.loading( "show" );

    post_url = "/login/register";
    nama     = $( "#daftar-nama" ).val();
    email    = $( "#daftar-email" ).val();
    username = $( "#daftar-username" ).val();
    password = $( "#daftar-password" ).val();
    passconf = $( "#daftar-passconf" ).val();

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            nama: nama, 
            email: email,
            username: username, 
            password: password,
            passconf: passconf,
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in == true) {
                console.log("Registrasi berhasil.");

                $('#login-notif').html(obj.notification);
                $('#login-popup').popup('open');

                window.localStorage["username"] = username;
                window.localStorage["password"] = password;

                setTimeout(function (){
                    location.hash = "home-page";
                }, 2000);
                
            } else {
                $.mobile.loading( "hide" );

                $('#login-notif').html(obj.notification);
                $('#login-popup').popup('open');

                console.log("Registrasi gagal, " . obj.notification);
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});

// --------------------------------- End Login Page ---------------------------------

// --------------------------------- Start Home Page ---------------------------------

$( document ).on( "pagecreate", "#home-page", function() {
});

// --------------------------------- End home Page ---------------------------------

// --------------------------------- Start belajar Page ---------------------------------

$( document ).on( "pagecreate", "#belajar-page", function() {
    $.mobile.loading( "show" );

    post_url = "/siswa/get_mapel";

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            request: "mata_pelajaran"
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in == true) {
                console.log("Mengambil data mata pelajaran.");
                $( '#mapel-belajar' ).html( obj.data.get_mapel );
                $( '#mapel-belajar' ).listview( "refresh" );
                
            } else {
                $.mobile.loading( "hide" );

                $('#belajar-notif').html("Anda harus melakukan login untuk mengakses halaman ini.");
                $('#belajar-popup').popup('open');

                console.log("Wajib login untuk mengakses halaman ini.");
                setTimeout(function (){
                    location.hash = "public-page";
                }, 2000);
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});

$( document ).on( "vclick", "#open-learning", function() {
    $.mobile.loading( "show" );

    id_mapel = $( this ).data('id_mapel');

    post_url = "/siswa/get_learning";

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            request: "materi_learning",
            id_mapel: id_mapel
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in == true) {
                console.log("Mengambil data learning > id_mapel = " + id_mapel + '.');

                location.hash = 'belajar_materi-page';

                $( '#mapel-belajar_materi' ).html( obj.data.get_learning);
               //$( '#mapel-belajar_materi' ).listview( "refresh" );
                
            } else {
                $.mobile.loading( "hide" );

                $('#belajar_materi-notif').html("Anda harus melakukan login untuk mengakses halaman ini.");
                $('#belajar_materi-popup').popup('open');

                console.log("Wajib login untuk mengakses halaman ini.");
                setTimeout(function (){
                    location.hash = "public-page";
                }, 2000);
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});

$( document ).on( "vclick", "#open-materi", function() {
    $.mobile.loading( "show" );

    id = $( this ).data('id_materi');

    post_url = "/siswa/get_materi";

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            request: "materi_learning",
            id: id
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in == true) {
                console.log("Mengambil materi > id = " + id + '.');

                location.hash = 'materi-page';

                $( '#materi-isi' ).html( obj.data.get_materi);
                
            } else {
                $.mobile.loading( "hide" );

                $('#materi-notif').html("Anda harus melakukan login untuk mengakses halaman ini.");
                $('#materi-popup').popup('open');

                console.log("Wajib login untuk mengakses halaman ini.");
                setTimeout(function (){
                    location.hash = "public-page";
                }, 2000);
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});

// --------------------------------- End belajar Page ---------------------------------

// --------------------------------- Start ujian Page ---------------------------------

$( document ).on( "pagecreate", "#page-ujian", function() {

    $.mobile.loading( "show" );

    post_url = "/siswa/get_mapel_ujian";

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            request: "mata_pelajaran"
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in == true) {
                console.log("Mengambil data mata pelajaran.");
                $( '#ujian-mapel' ).html( obj.data.get_mapel );
                $( '#ujian-mapel' ).listview( "refresh" );
                
            } else {
                $.mobile.loading( "hide" );

                $('#ujian-notif').html("Anda harus melakukan login untuk mengakses halaman ini.");
                $('#ujian-popup').popup('open');

                console.log("Wajib login untuk mengakses halaman ini.");
                setTimeout(function (){
                    location.hash = "public-page";
                }, 2000);
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});

$( document ).on( "vclick", "#open-ujian", function() {
    $.mobile.loading( "show" );

    id_mapel = $( this ).data('id_mapel');

    post_url = "/siswa/get_ujian";

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            request: "ujian",
            id_mapel: id_mapel
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in == true) {
                console.log("Mengambil ujian > id_mapel = " + id_mapel + '.');

                if (obj.data.seri == false) {
                    $('#ujian-notif').html("Semua soal ujian " + obj.data.mapel + " telah diselesaikan. Untuk saat ini pilihlah mata pelajaran yang lainnya.");
                    $('#ujian-popup').popup('open');
                } else {
                    ujian_mapel = id_mapel;
                    ujian_seri  = obj.data.seri;

                    location.hash = 'page-start_ujian';
                    $( '#start_ujian-seri' ).html( obj.data.seri);
                    $( '#start_ujian-mapel' ).html( obj.data.mapel);
                }
            } else {
                $.mobile.loading( "hide" );

                $('#ujian-notif').html("Anda harus melakukan login untuk mengakses halaman ini.");
                $('#ujian-popup').popup('open');

                console.log("Wajib login untuk mengakses halaman ini.");
                setTimeout(function (){
                    location.hash = "public-page";
                }, 2000);
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});

$( document ).on( "vclick", "#go_ujian", function() {
    $.mobile.loading( "show" );

    post_url = "/siswa/init_ujian";

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            request: "init_ujian",
            id_mapel: ujian_mapel,
            no_seri: ujian_seri,
            nomor_soal: ujian_nomor
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in == true) {
                console.log("Menginisialisasi ujian dengan seri " + ujian_seri + '.');
                location.hash = 'page-progress';

                jumlah_soal = obj.data.jumlah_soal;
                $('#progress-soal').html(obj.data.soal);
                $('#ans-a').html("A. " + obj.data.jawaban_a);
                $('#ans-b').html("B. " + obj.data.jawaban_b);
                $('#ans-c').html("C. " + obj.data.jawaban_c);
                $('#ans-d').html("D. " + obj.data.jawaban_d);
                $('#ans-e').html("E. " + obj.data.jawaban_e);
                $('#ujian-back').prop('disabled', true);
                $('#ujian-hint').prop('disabled', false);
                $('#ujian-next').prop('disabled', false);

            } else {
                $.mobile.loading( "hide" );

                $('#ujian-notif').html("Anda harus melakukan login untuk mengakses halaman ini.");
                $('#ujian-popup').popup('open');

                console.log("Wajib login untuk mengakses halaman ini.");
                setTimeout(function (){
                    location.hash = "public-page";
                }, 2000);
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});

$( document ).on( "vclick", "#ujian-next", function() {
    ujian_nomor++;

    if (ujian_nomor == jumlah_soal) {
        location.hash = "page-finish_ujian";
    } else {
        get_soal();
    }
    
});

function get_soal() {
    $.mobile.loading( "show" );

    post_url = "/siswa/update_ujian";

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            request: "update_ujian",
            id_mapel: ujian_mapel,
            no_seri: ujian_seri,
            nomor_soal: ujian_nomor
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in == true) {
                console.log("Menginisialisasi ujian dengan seri " + ujian_seri + '.');
                location.hash = 'page-progress';

                jumlah_soal = obj.data.jumlah_soal;
                $('#progress-soal').html(obj.data.soal);
                $('#ans-a').html("A. " + obj.data.jawaban_a);
                $('#ans-b').html("B. " + obj.data.jawaban_b);
                $('#ans-c').html("C. " + obj.data.jawaban_c);
                $('#ans-d').html("D. " + obj.data.jawaban_d);
                $('#ans-e').html("E. " + obj.data.jawaban_e);
                $('#ujian-back').prop('disabled', true);
                $('#ujian-hint').prop('disabled', false);
                $('#ujian-next').prop('disabled', false);

            } else {
                $.mobile.loading( "hide" );

                $('#ujian-notif').html("Anda harus melakukan login untuk mengakses halaman ini.");
                $('#ujian-popup').popup('open');

                console.log("Wajib login untuk mengakses halaman ini.");
                setTimeout(function (){
                    location.hash = "public-page";
                }, 2000);
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
}
// --------------------------------- End ujian Page ---------------------------------
