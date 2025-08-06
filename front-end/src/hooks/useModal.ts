import { useState, useCallback, useMemo } from "react";

const useModal = () => {
    const [modalActive, setModalActive] = useState<string | null>(null);
    
    const showModal = useCallback((modal: string | null) => setModalActive(modal), []);
    const modalIsOpen = useCallback((modal: string) => modal === modalActive, [modalActive]);
    const hideModal = useCallback(() => setModalActive(null), []);

    return useMemo(() => ({ showModal, hideModal, modalIsOpen }), [showModal, hideModal, modalIsOpen]) 
}

export default useModal;