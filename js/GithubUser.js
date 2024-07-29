export class GithubUser {
    static async  search(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`)

            if(!response.ok) {
                throw new Error(`Error fetching user: ${response.statusText}`)
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