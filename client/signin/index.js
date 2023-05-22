var vue_app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
        showPassword: false,
        pass: '',
        email: '',
        info: { values: [] },

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
    },
    methods: {
        login: function(name, surname, username, email, pass, img){
            console.log(name + "\n" +surname + "\n" + username + "\n" + email + "\n" + pass + "\n" + img)
            this.info.values.push(name);
            this.info.values.push(surname);
            this.info.values.push(username);
            this.info.values.push(email);
            this.info.values.push(pass);
            this.info.values.push(img);

            fetch("https://tenarse.online/google",
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
                    const redirectUrl = data.redirectUrl;
                    window.location.href = redirectUrl;
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        },

        verify_login: function(username, pass){
            this.info.values =[];
            this.info.values.push(username);
            this.info.values.push(pass);
            console.log(username, pass)
            fetch("https://tenarse.online/verifyLogin",
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
                    const redirectUrl = data.redirectUrl;
                    window.location.href = redirectUrl;
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        }
    }
})


/* ID CLIENT 473605537300-nf5611uhudkvb5qe7as91131c4fsgvcf.apps.googleusercontent.com */

/* SECRETO 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 */