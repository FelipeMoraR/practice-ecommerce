import { ReactNode } from "react"

type TypeCard = 1 | 2 | 3 | 4 | 5;

interface ICardInfo {
    header: ReactNode;
    body: ReactNode;
    typeCard: TypeCard
}
const CardInfo = ({ header, body, typeCard = 1 }: ICardInfo) => {
    const stylesTypeCard = {
        1: 'flex flex-col gap-3 fade-in outline-4 outline-yellow border-t-4 border-l-4 border-yellow-darkest bg-yellow-lightest p-3 w-full h-full',
        2: 'flex flex-col gap-3 fade-in outline-4 outline-red border-t-4 border-l-4 border-red-darkest bg-red-lightest p-3 w-full h-full',
        3: 'flex flex-col gap-3 fade-in outline-4 outline-green border-t-4 border-l-4 border-green-darkest bg-green-lightest p-3 w-full h-full',
        4: 'flex flex-col gap-3 fade-in outline-4 outline-black-lighter border-t-4 border-l-4 border-black bg-black-lightest p-3 w-full h-full',
        5: 'flex flex-col gap-3 fade-in outline-4 outline-dark border-t-4 border-l-4 border-gray-lighter bg-gray-lightest p-3 w-full h-full',
    }

    return (
        <div className={stylesTypeCard[typeCard]}>
            {header}
            {body}
        </div>
    )
}

export default CardInfo