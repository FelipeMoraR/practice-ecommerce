import { useState, useCallback, useMemo, useEffect } from "react";

const useModal = () => {
    const [modalActive, setModalActive] = useState<string | null>(null);
    
    const showModal = useCallback((modal: string | null) => setModalActive(modal), []);
    const modalIsOpen = useCallback((modal: string) => modal === modalActive, [modalActive]);
    const hideModal = useCallback(() => setModalActive(null), []);

    useEffect(() => {
        console.log('modal active => ', modalActive);
    }, [modalActive]);

    return useMemo(() => ({ showModal, hideModal, modalIsOpen }), [showModal, hideModal, modalIsOpen]) 
}

export default useModal;