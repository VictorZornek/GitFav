export class GithubUser {
    static async search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        try {
            const response = await fetch(endpoint)

            if(!response.ok) {
                throw new Error(`Error fetching user: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                login: data.login,
                name: data.name,
                public_repos: data.public_repos,
                followers: data.followers
            }

        } catch(error) {
            alert(error.message)

            return null
        }
    }
}





// classe que vai conter a lógica dos dados
// como os dados serão estruturados

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

        GithubUser.search('victorzornek').then(user => console.log(user))

    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@git-fav:')) || []
    }


    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
    
        this.entries = filteredEntries
        this.update()
    }
}





// classe que vai criar a visualização e eventos do HTML

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')  // -> busca o tbody

        this.update()
    }

    update() {
        this.removeAllTr()
        
        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user-info').href = `https://github.com/${user.login}`
            row.querySelector('.user-info p').textContent = user.name
            row.querySelector('.user-info span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers;

            row.querySelector('.remove').onclick = () => {
                const okDelete = confirm('Tem certeza que deseja deletar esse usuário cadastrado?')

                if(okDelete) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)  // -> adiciona as rows com as infos dos usuários no tbody
        })

    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/victorzornek.png" alt="Imagem de Victor Zornek">
                <a class="user-info" href="https://github.com/victorzornek" target="_blank">
                    <p>Victor Zornek</p>
                    <span>/victorzornek</span>
                </a>
            </td>
            <td class="repositories">
                33
            </td>
            <td class="followers">
                4
            </td>
            <td class="remove">
                <button>Remover</button>
            </td>
        `

        return tr
    }

    removeAllTr() {
        const tbody = document.querySelector('table tbody')
        tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
        
    }
}