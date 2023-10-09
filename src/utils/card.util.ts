import { cards } from "../assets"

const list_card: Array<ICard> = cards

export type ICard = {
    label: string,
    txt: string,
    img: any
}

export async function randomCard(card1: Array<ICard> = [], card2: Array<ICard> = [], card3: Array<ICard> = []) {
    //@ts-ignore
    const exits_card: Array<ICard> = [...card1, ...card2, ...card3]
    console.log(exits_card)
    const remaining_card = list_card.filter((obj) => !exits_card.some((item) => item.label === obj.label));
    const shuffled: ICard[] = remaining_card.sort(() => 0.5 - Math.random());
    const random_card: ICard[] = shuffled.slice(0, 13);
    return random_card
}

export function getCardFromBox(box: any[]) {
    let set = new Set()
    let cards: ICard[] = []
    for (const element of box) {
        if (!set.has(element.name)) {
            const tmp = list_card.find(x => x.label === element.name)
            if (tmp) {
                cards.push(tmp)
                set.add(element.name)
            }
        }
    }
    return cards
}