var vue_app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
      publicacions: {},
      perfiles: [],
      infoDialog: false
    },
    created(){
      fetch("http://localhost:4000/getPublicacions",
          {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
              },
              credentials: "include",
              body: '',
              mode: "cors",
              cache: "default"
          }
      ).then(
          (response) => {
              return (response.json());
          }
      ).then(
          (data) => {
              this.publicacions = data;
              console.log(this.publicacions)
          }
      ).catch(
          (error) => {
              console.log(error);
          }
      );
        },
    mounted() {
        const menu = document.querySelector('ul');

      
        const icon = document.getElementById('icon-new');
        console.log(icon)
        // Get the button
        const menuToggle = document.querySelectorAll('#menu-toggle');
        menuToggle.forEach((toggle) => {
          toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
          });
        });

        document.addEventListener('click', function(event) {
          console.log(event.target)
          if (event.target != menuToggle[0] && event.target != icon && !menu.contains(event.target)) {
            // Hide the ul element or remove the active class
            menu.classList.remove('active');
          }
        });

        logo.addEventListener('click', () => {
          logo.classList.toggle('rotate');
          setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });          }, 1000);;
        });


 
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
/*                     return (window.location.href = response.url);
 */
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
        },
        showMyProfile: function(){
         fetch("http://localhost:4000/app/myprofile/",
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
/*                     return (window.location.href = response.url);
 */
                    return (response.json());
                } 
            ).then(
                (data) => {
                    console.log(data) 
                }
            ).catch( 
                (error) => {
                    console.log(error);
                } 
            );
        },
        getProfiles: function(){
            fetch("http://localhost:4000/getProfiles/",
                   {
                       method: "POST",
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
                       this.perfiles = data;
                       console.log(this.perfiles);
                   }
               ).catch( 
                   (error) => {
                       console.log(error);
                   } 
               );
           }
      }
})
