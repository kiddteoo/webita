var vue_app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
        showPassword: false,
        pass: '',
        email: '',
        info: { values: [] },

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

            fetch("http://localhost:4000/google",
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