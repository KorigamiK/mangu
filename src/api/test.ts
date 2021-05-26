export class hello {
    thing: string 
    constructor(){
        this.thing = "This is the default inside the component!"
    }
    static thing = "This is changed hello from the static world!";
    static secret = "This is very secret"
}