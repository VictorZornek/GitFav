import { GithubUser } from "./GithubUser.js"

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

    save() {
        localStorage.setItem('@git-fav:', JSON.stringify(this.entries))
    }


    async addUser(username) {

        try {
            const userExists = this.entries.find(entry => entry.login.toLowerCase() == username.toLowerCase())

            if(userExists) {
                throw new Error('Usuário já está cadastrado!')
            }

            
            const user = await GithubUser.search(username)

            if(user.login == undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }

    }


    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
    
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}




// classe que vai criar a visualização e eventos do HTML

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')  // -> busca o tbody

        this.update()
        this.onAddUser()
    }

    onAddUser() {
        const addButton = this.root.querySelector('.search button')

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            console.log('Botão clicado, valor:', value)
            this.addUser(value)
        }
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