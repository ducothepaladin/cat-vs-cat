export class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public friends: any[]
    ) {}

    getFriends() {
        return this.friends
    }
}