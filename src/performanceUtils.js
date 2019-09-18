export class StopWatch {
    constructor(name) {
        this.name = name
        this.start = performance.now()
    }
    end = null
    stop = () => {
        this.end = performance.now()
        console.log(`Time elapsed for stopWatch ${this.name} is ${(this.end - this.start) / 1000} seconds`)
    }
}