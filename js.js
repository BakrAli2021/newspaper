// /* fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=b163f18e61a942fe898bc26f6abf7c2c').then((r) => r.json()).then((data) => {
//     for (x in data.articles) {
//         console.log(data.articles[x]);
//         document.writeln(data.articles[x].description + '<br>');
//     }
// });
//  */
// // Note: This example requires that you consent to location sharing when
// // prompted by your browser. If you see the error "The Geolocation service
// // failed.", it means you probably did not give permission for the browser to
// // locate you.


let map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6,
    });
    infoWindow = new google.maps.InfoWindow();

    const locationButton = document.createElement("button");

    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    /* map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Location found.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }); */


}

function getlocation(lattut = position.coords.latitude, langut = position.coords.longitude) {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: lattut,
                    lng: langut,
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent("You Are Here.");
                infoWindow.open(map);
                map.setCenter(pos);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

function weather(city) {
    fetch('https://api.weatherapi.com/v1/current.json?key=35c78f9358394e30b3d62303210912&q=' + city + '&aqi=yes').then((r) => r.json()).then((data) => {
        //console.log(data);
        document.querySelector('.weather_info .sunny .weather_desc').textContent = data.current.condition.text;

        document.querySelector('.weather_info .sunny .weather_img').src = data.current.condition.icon;

        document.querySelector('.weather_info .sunny .date').innerHTML =
            `<p><span>Last Update date:</span> ${(data.current.last_updated).substr(0, 10)}</p>
        <p><span>last update Time:</span> ${(data.current.last_updated).substr(10, 15)}</p>`;

        document.querySelector('.weather_info .temp_city .temp').innerHTML = `${data.current.temp_c} <sup>c</sup>`;

        document.querySelector('.weather_info .temp_city .city').innerHTML = `<span>Country:</span>  ${data.location.country}  <br> <span>Region:</span> ${data.location.name}`;
        document.getElementById('temp_degree').style.cssText = `height:${data.current.temp_c + 'px'};bottom:-${35-data.current.temp_c}px;`;
        document.getElementById('wind_speed').textContent = data.current.wind_degree;
        document.getElementById('wind_dir').textContent = data.current.wind_dir;

        document.getElementById('pressure').textContent = data.current.pressure_in;
        getlocation(data.location.lat, data.location.lon);
    }).catch((error) => {
        //console.log(error)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This city Not found',
        })
    });

}
/////////////// ip api 
// weather stuts with geolocation
/* fetch('http://ip-api.com/json').then((r) => r.json()).then((data) => {
    let city = data.city;
    weather(city);

}).catch((er) => {
    console.log(er)
}); */

//// get news by geolaction country
fetch('https://api.ipgeolocation.io/ipgeo?apiKey=60fb48899cec40a3aa2c25a87e760908').then((r) => r.json()).then((data) => {
    let city = data.city;
    weather(city);
    country = data.country_tld.replace('.', '');

    /// get news
    fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=fa2de4579b6f4ad485d46b88f55ca646`).then((resp) => resp.json()).then((data) => {

        if (data.articles.length != 0) {
            card.style.display = "grid";
            for (x in data.articles) {

                add_news_to_html(data);

            }

        } else {
            card.innerHTML = `<img class='not_found' src="img/not_found2.jpg" alt="" srcset="">`;
            card.style.display = "flex";
        }
    }).catch((er) => {
       // console.log(er);
        card.innerHTML = `<img class='not_found' src="img/not_found2.jpg" alt="" srcset="">`;
        card.style.display = "flex";
    });

}).catch((error) => {
   // console.log(error + 'can not fetch data');
});

///////////////////////////////// get data by search button
let input_text = document.getElementById('search_input');
document.getElementById('search_btn').addEventListener('click', () => {
    let city = input_text.value;
    weather(city);
});
input_text.addEventListener('change', () => {
        weather(input_text.value);
    })
    //////////////////////////////////////


/////////////////// countries api
let show_country_ul = document.querySelector('.selected');
fetch('https://countriesnow.space/api/v0.1/countries/flag/images').then((r) => r.json()).then((data) => {
    let ul_coutries = document.querySelector('.countries');

    show_country_ul.innerHTML = `<li><span>${data.data[1].name}</span> <img src=${data.data[1].flag} width=20px> <i class="fas fa-search icon_search"></i></li>`;
    for (x in data.data) {
        //console.log(data.data[x].flag);
        if (data.data[x].flag == 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Israel.svg' || data.data[x].flag == 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Afghanistan.svg') {
            continue;
        }
        //  selectbox_countries.innerHTML += `<option data-img="${data.data[x].flag}" value="${data.data[x].name}"></option>
        // `;

        ul_coutries.innerHTML += `<li><span>${data.data[x].name}</span> <img src=${data.data[x].flag} width=20px></li>`;
    }
    ///////////////////// countries
    let countries_flags = document.querySelectorAll('.countries li'),
        list_of_country = document.querySelectorAll('.countries li'),
        input_ul_search = document.getElementById('country_search'),
        icon_search = document.querySelector('.icon_search');

    countries_flags.forEach((e) => {
        e.addEventListener('click', () => {
            ///////// weathe function
            weather(e.firstElementChild.textContent);
            ////////// select countries
            document.querySelector('.selected li').innerHTML = e.innerHTML + `<i class="fas fa-search icon_search"></i>`;


            //// hide input search 
            input_ul_search.classList.remove('look');
            input_ul_search.value = '';
            document.querySelector('.icon_search').addEventListener('click', () => {
                input_ul_search.classList.toggle('look');
                ul_coutries.classList.toggle('diplay_toggle');
            });
        });

    });
    //// hide input search 
    icon_search.addEventListener('click', () => {
        input_ul_search.classList.toggle('look');
    });
    show_country_ul.addEventListener('click', () => {
        ul_coutries.classList.toggle('diplay_toggle');
    });

    ////////////// search in ul 
    // display countries list ul
    input_ul_search.addEventListener('focus', () => {
        ul_coutries.style.display = 'block';
    });
    ///// search filter
    input_ul_search.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        Array.from(list_of_country).forEach((e) => {
            const title = e.firstElementChild.textContent;
            if (title.toLowerCase().indexOf(term) != -1) {
                e.style.display = 'flex';
            } else {
                e.style.display = 'none';
            }
        })

    })


});

/////////////////////////////////
window.addEventListener('load', (event) => {
    document.querySelector('#map div').nextElementSibling.remove();

});
/////////////// hover 
let card = document.querySelector('.news_container');
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;

function get_news(news, date_range = today) {

    // clear container befor add news
    card.innerHTML = '';
    fetch(`https://newsapi.org/v2/everything?q=${news}&from=${date_range}&sortBy=popularity&apiKey=fa2de4579b6f4ad485d46b88f55ca646`).then((res) => res.json()).then((data) => {
        if (data.articles.length != 0) {
            card.style.display = "grid";
            for (x in data.articles) {

                add_news_to_html(data);

            }

        } else {
            card.innerHTML = `<img class='not_found' src="img/not_found.jpg" alt="" srcset="">`;
            card.style.display = "flex";
        }
        /*  Array.from(document.querySelectorAll('.card .img_box')).forEach((e) => {
            const imgs = Array.from(e.querySelectorAll('img'));
            console.log(imgs[0]);
            new hoverEffect({
                parent: e,
                intensity: 0.3,
                image1: imgs[0].getAttribute('src'),
                image2: imgs[0].getAttribute('src'),
                displacementImage: 'img/dot.jpg'
            });
        });
 */
    }).catch((er) => {
        console.log(er);
        card.innerHTML = `<img class='not_found' src="img/not_found2.jpg" alt="" srcset="">`;
        card.style.display = "flex";
    });
}

/***********************  news container function to add data from api to html page */
function add_news_to_html(data) {

    card.innerHTML += `
            <div class="card">
            <div class="card_content">
                <div class="img_box">
                    <img src=${data.articles[x].urlToImage} width="200" alt="" srcset="" onerror="this.onerror=null; this.src='img/no_photo.jpg'">

                </div>
                <div class="data">
                    <h3 class="paper_name"><span>NewsPaper: </span> ${data.articles[x].source.name}</h3>
                    <p class="article_title"><span>Tilte: </span>${data.articles[x].title}</p>
                    <p class="article_desc">${data.articles[x].description==null?'No Description For This Articles':data.articles[x].description}</p>
                    <p class="publish_time"><span>Time: </span>${data.articles[x].publishedAt}</p>
                    <p class="article_link"> <a href="${data.articles[x].url}" target="_blank" rel="noopener noreferrer">Read More</a></p>
                </div>
            </div>
        </div>
            `;


}
//get_news('Tesla');

/// search from inputbox 
let search_news_input = document.getElementById('news_serach'),
    news_value = '';
search_news_input.addEventListener('keyup', () => {
    news_value = search_news_input.value;

});

/// search  with date input
let search_date = document.getElementById('search_date'),
    news_date = today;
search_date.value = today;

search_date.addEventListener('change', () => {
    news_date = search_date.value;
});

/// search by click search button
document.getElementById('search_button').addEventListener('click', () => {
    console.log('done');
    get_news(news_value, news_date);
});
// When the user scrolls the page, execute myFunction
window.onscroll = function() { myFunction() };

function myFunction() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
}
/*
/////////////// contact dorm to send email
(function() {
    emailjs.init("user_tYxkxc9IRlX2KFDgLdHgW");
})();


function send() {
    emailjs.send("service_p5qq3ba", "template_hp5cxy8", {
        from_name: document.getElementById('from_name').value,
        to_name: "bakr",
        message: document.getElementById('message').value,
        email_to: "bakr29495@gmail.com",
    }).then((response) => {
        console.log('sent message', response.status);
    }, (error) => {
        console.log(error)
    })
}
document.querySelector('.send').addEventListener('click', send);*/
