var vue_app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
      perfil: {},
      lenFollowers: '',
      lenFollowing: ''
    },
    created(){
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
                console.log(this.perfil)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
          },
      methods: {
      }
})
