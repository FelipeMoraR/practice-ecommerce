import { ReactNode } from "react"

type TypeCard = 1 | 2;

interface ICardInfo {
    header: ReactNode;
    body: ReactNode;
    typeCard: TypeCard
}
const CardInfo = ({ header, body, typeCard = 1 }: ICardInfo) => {
    const stylesTypeCard = {
        1: 'flex flex-col gap-3 fade-in border-4 border-red p-2',
        2: ''
    }

    return (
        <div className={stylesTypeCard[typeCard]}>
            {header}
            {body}
        </div>
    )
}

export default CardInfo