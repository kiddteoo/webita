var vue_app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
      publicacions: {},
      perfiles: [],
      infoDialog: false,
      searchTerm: ''
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


        const btn = document.querySelectorAll('.btn-up');
            console.log(btn);
            window.addEventListener("scroll", function() {
                if (window.scrollY === 0) {
                    btn[0].style.display="none";
                } else {
                    btn[0].style.display="block";
                }
              });

              btn[0].addEventListener('click', function() {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
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
                    return (window.location.href = response.url);
/*                     return (response.json());
 */                }
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
              return (window.location.href = response.url);
 
/*                     return (response.json());
 */                } 
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
        filteredPerfiles: function() {
            console.log("filteredPerfiles called");

            return this.perfiles.filter(perfil =>
            
              perfil.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
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
           },
           async tryShare() {
            try {
              await navigator.share({
                title: "Tenarse App",
                text: "Welcome To Tenarse, join now!!!",
                url: "http://localhost:4000/public"
              });
              console.log("Content shared successfully!");
            } catch (error) {
              console.error("Error sharing content:", error);
            }
          }

      }
})
