var vue_app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data () {
        return {
            colors: [
              'indigo',
              'warning',
              'pink darken-2',
              'red lighten-1',
              'deep-purple accent-4',
            ],
            slides: [
              'First',
              'Second',
              'Third',
              'Fourth',
              'Fifth',
            ],
            profile: ''
          }
    },
    mounted() {
        let prevScrollPos = window.pageYOffset;
        window.onscroll = function() {
          let currentScrollPos = window.pageYOffset;
          if (prevScrollPos > currentScrollPos) {
            document.querySelector('.header-app').style.position = 'fixed';
            document.querySelector('.header-app').style.transition = '0.5s ease !important';
            document.querySelector('.header-app').style.transform = 'translateY(0px)';
          } else {
            document.querySelector('.header-app').style.position = 'relative'; // change 64px to the height of your app bar
            document.querySelector('.header-app').style.transition = '10s ease !important';
            document.querySelector('.header-app').style.transform = 'translateY(-100px)';
          }
          prevScrollPos = currentScrollPos;
        }
      },

      methods: {
        showPerfil: function(id){
          console.log(id);
         fetch("http://localhost:4000/app/profile/" + id,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: "include",
                    mode: "cors",
                    cache: "default"
                }
            ).then(
                (response) => {
                    return (response.json());
                }
            ).then(
                (data) => {
                    console.log(data)
                }
            ).catch(
                (error) => {
                  window.location.href = "http://localhost:4000/app/profile";
                    console.log(error);
                }
            );
        }
      }
})
