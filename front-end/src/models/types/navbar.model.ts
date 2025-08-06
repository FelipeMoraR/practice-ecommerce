export interface IPageNavbar {
    text: string;
    anchor: string
}

export interface IPageNavbarFather extends IPageNavbar {
    subPages: Array<IPageNavbar> | null;
}

export interface INavbar{
    imgRoute: string;
    pages: Array<IPageNavbarFather>;
}

export interface INavbarContentMobile {
    elementClicked: number | null;
    handlerNavbarSlidersClick(index: number): void;
    pages: Array<IPageNavbarFather>;
}



