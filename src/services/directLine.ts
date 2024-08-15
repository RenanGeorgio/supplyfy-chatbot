import { DirectlineService } from "../libs/bot/connector/directLine";

export function direclineSubscribe(name: string) {
    return new Promise(() => {
        console.log("Directline subscribing...")
        const directLineService = DirectlineService.getInstance();
        return directLineService.subscribeBot(name)
    })
}
