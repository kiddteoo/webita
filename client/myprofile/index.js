var vue_app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
      perfil: {},
      myprof: {},
        infoDialog2: false,
        username_new: '',
        name_new: '',
        lastname_new: '',
      lenFollowers: '',
      lenFollowing: '',
      lenPost: '',
      profiles: [],
      following: 0,
      info: { values: [] },
        img_new: null,
        img_changed: null,
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
                console.log(this.myprof)
                this.lenFollowers = this.myprof.followers.length;
                this.lenFollowing = this.myprof.followings.length;
                this.lenPost = this.myprof.publicacions.length;
                this.username_new = this.myprof.username;
                this.name_new = this.myprof.nombre;
                this.lastname_new = this.myprof.apellidos;
                this.myprof.followers.forEach(fol => {
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

                this.myprof.followings.forEach(fol => {
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

        updateInfo: function(){
            console.log(this.myprof._id);
            console.log(this.username_new);
            console.log(this.name_new);
            console.log(this.myprof.url_img)
            console.log(this.lastname_new);
            console.log(this.myprof.fecha_nac);
            this.info.values = []
            this.info.values.push(this.myprof._id);
            this.info.values.push(this.myprof.email)
            this.info.values.push(this.username_new)
            this.info.values.push(this.name_new)
            if(!this.img_new){
                this.info.values.push(this.myprof.url_img)
            }
            else{
                this.info.values.push(this.img_new);
            }
            this.info.values.push(this.lastname_new)
            this.info.values.push(this.myprof.fecha_nac)
            fetch("http://localhost:4000/updateUser/",
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
                    console.log(data)
                    this.myprof = data
                    this.lenFollowers = this.myprof.followers.length;
                    this.lenFollowing = this.myprof.followings.length;
                    this.lenPost = this.myprof.publicacions.length;
                    this.username_new = this.myprof.username;
                    this.name_new = this.myprof.nombre;
                    this.lastname_new = this.myprof.apellidos;
                    this.myprof.url_img = this.myprof.url_img;
                    const img = document.getElementById('id_img');
                    img.src =  `${img.src}?t=${new Date().getTime()}`;
                    console.log(img)

                    this.myprof.followers.forEach(fol => {
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
    
                    this.myprof.followings.forEach(fol => {
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
        uploadImage: function () {
            const fileInput = document.getElementById('file-input');
            
            const file = fileInput.files[0];
            
            console.log(file)

            const formData = new FormData();
            formData.append('image', file);
            console.log(formData)
            fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Image uploaded successfully!');
                        document.getElementById('file-input').value = "";
                        this.img_new = "http://localhost:4000/uploads/"+ this.myprof._id + '.png';
                        vue_app.updateInfo();
                    } else {
                        console.error('Failed to upload image!');
                    }
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                });
        },
      }
})
