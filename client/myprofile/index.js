var vue_app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
      perfil: {},
      myprof: {},

      lenFollowers: '',
      lenFollowing: '',
      lenPost: '',
      profiles: [],
      following: 0,
      followersList: [],
      followingList: []
    },
    created(){
        fetch("http://localhost:4000/getProfiles",
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
                this.profiles = data

            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
        fetch("http://localhost:4000/getMyProfil",
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
                this.myprof = data
                this.lenFollowers = this.myprof.followers.length;
                this.lenFollowing = this.myprof.followings.length;
                this.lenPost = this.myprof.publicacions.length;

                this.myprof.followers.forEach(fol => {
                    this.profiles.forEach(perfil => {
                        if (perfil._id == fol.user) {
                            var users = {
                                user_img: perfil.url_img,
                                username: perfil.username
                            }

                            this.followersList.push(users);
                        }
                    })
                })

                this.myprof.followings.forEach(fol => {
                    this.profiles.forEach(perfil => {
                        if (perfil._id == fol.user) {
                            var users = {
                                user_img: perfil.url_img,
                                username: perfil.username
                            }

                            this.followingList.push(users);
                        }
                    })
                })
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
          },

          mounted(){
            const main = document.createElement('div');
            main.classList.add('circle-main');
            document.body.appendChild(main);
            
            const second = document.createElement('div');
            second.classList.add('second-circle');
            document.body.appendChild(second);
            
            
            document.addEventListener('mousemove', function(e){
                const x = e.clientX;
                const y = e.clientY;
            
                second.style.transform = `translate(${x}px, ${y}px)`;
                main.style.transform = `translate(${x}px, ${y}px)`;
            
                const hvr = document.querySelectorAll('.hoverable');
            
                Array.from(hvr).forEach((hvrEL) => {
                    hvrEL.addEventListener('mouseover', (e) => {
                        main.classList.add('circle-hide');
                        second.classList.add('circle-scale');
                    })
                })
            
                Array.from(hvr).forEach((hvrEL) => {
                    hvrEL.addEventListener('mouseout', (e) => {
                        main.classList.remove('circle-hide');
                        second.classList.remove('circle-scale');
                    })
                });
            
            });

 

    
            const menuToggle4 = document.querySelector("#followers-toggle")
            const menu2 = document.querySelector('.ul-parent3');
    
            const menuToggle3 = document.querySelector("#following-toggle")
            const menu = document.querySelector('.ul-parent2');
            menuToggle4.addEventListener('click', () => {
                menu2.classList.toggle('active');
            })
    
            menuToggle3.addEventListener('click', () => {
                menu.classList.toggle('active');
            })
    
            document.addEventListener('click', function (event) {
                if ((event.target != menuToggle4) && !menu2.contains(event.target) && (event.target != menuToggle3) && !menu.contains(event.target)) {
                    // Hide the ul element or remove the active class
                    menu2.classList.remove('active');
                    menu.classList.remove('active');
                }
            });
          },
      methods: {
        
        goBack: function()
        {
          window.history.back();
        },
      }
})
