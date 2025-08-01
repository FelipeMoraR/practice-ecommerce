export interface IPageNavbar {
    text: string;
    anchor: string
}

export interface IPageNavbarFather extends IPageNavbar {
    subPages: Array<IPageNavbar> | null;
}

export interface INavbarContent extends INavbar {
    elementClicked: number | null;
    handlerNavbarSlidersClick(index: number): void;
}

export interface INavbar {
    imgRoute: string;
    pages: Array<IPageNavbarFather>;
}