var vue_app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
        perfil: {},
        myprof: {},
        profiles: [],
        info: { values: [] },

        lenFollowers: '',
        lenFollowing: '',
        lenPost: '',
        showTooltip: false,
        following: 0,
        followersList: [],
        followingList: []

    },
    created() {
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

            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
        fetch("http://localhost:4000/getProf",
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
                this.perfil = data
                this.lenFollowers = this.perfil.followers.length;
                this.lenFollowing = this.perfil.followings.length;
                this.lenPost = this.perfil.publicacions.length;
                this.perfil.followers.forEach(fol => {
                    console.log(fol)
                    console.log(this.myprof._id)
                    if (fol.user == this.myprof._id)
                        this.following = 1;
                });

                console.log(this.perfil)
                this.perfil.followers.forEach(fol => {
                    this.profiles.forEach(perfil => {
                        if (perfil._id == fol.user) {
                            var users = {
                                id_user: perfil._id,
                                user_img: perfil.url_img,
                                username: perfil.username
                            }

                            this.followersList.push(users);
                        }
                    })
                })

                this.perfil.followings.forEach(fol => {
                    this.profiles.forEach(perfil => {
                        if (perfil._id == fol.user) {
                            var users = {
                                id_user: perfil._id,
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
    mounted() {
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
        const btn = document.querySelectorAll('.btn-up');
        console.log(btn);
        window.addEventListener("scroll", function () {
            if (window.scrollY === 0) {
                btn[0].style.display = "none";
            } else {
                btn[0].style.display = "block";
            }
        });

        btn[0].addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
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

        goBack: function () {
            window.history.back();
        },

        getProf: function () {
            this.info.values = []
            this.info.values.push(this.perfil._id);
            fetch("http://localhost:4000/getProf2",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify(this.info),
                    mode: "cors",
                    cache: "default"
                }
            ).then(
                (response) => {
                    return (response.json());
                }
            ).then(
                (data) => {
                    this.perfil = data
                    this.lenFollowers = this.perfil.followers.length;
                    this.lenFollowing = this.perfil.followings.length;
                    this.lenPost = this.perfil.publicacions.length;
                    console.log(this.perfil)
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        },

        showPubli: function (id) {
            console.log(id)
            window.location.href = '/app/publicacion_template?id=' + id

        },

        showPerfil: function (id) {
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
        follow: function () {
            console.log(this.perfil._id)
            console.log(this.myprof._id)
            this.info.values = []
            this.info.values.push(this.myprof._id)
            this.info.values.push(this.perfil._id)

            fetch("http://localhost:4000/newFollowing",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify(this.info),
                    mode: "cors",
                    cache: "default"
                }
            ).then(
                (response) => {
                    return (response.json());
                }
            ).then(
                (data) => {
                    this.following = 1;
                    this.getProf()
                    console.log(this.perfil)

                    var users = {
                        id_user: this.myprof._id,
                        user_img: this.myprof.url_img,
                        username: this.myprof.username
                    }
                    this.followersList.push(users);

                    var users = {
                        id_user: this.profile._id,
                        user_img: this.profile.url_img,
                        username: this.profile.username
                    }
                    this.followingList.push(users);
                    
                }


            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        },
        deleteFollow: function () {
            console.log(this.perfil._id)
            console.log(this.myprof._id)
            this.info.values = []
            this.info.values.push(this.myprof._id)
            this.info.values.push(this.perfil._id)

            fetch("http://localhost:4000/deleteFollowing",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify(this.info),
                    mode: "cors",
                    cache: "default"
                }
            ).then(
                (response) => {
                    return (response.json());
                }
            ).then(
                (data) => {
                    this.following = 0;
                    this.getProf()
                    
                    var users = {
                        user_img: this.myprof.url_img,
                        username: this.myprof.username
                    }
                    this.followersList.pop(users);

                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        }
    }
})
