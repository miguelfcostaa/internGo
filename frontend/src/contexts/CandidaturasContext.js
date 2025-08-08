import React, { createContext, useContext, useState, useCallback } from 'react';

const CandidaturasContext = createContext();

export const useCandidaturasContext = () => {
    const context = useContext(CandidaturasContext);
    if (!context) {
        throw new Error('useCandidaturasContext deve ser usado dentro de CandidaturasProvider');
    }
    return context;
};

export const CandidaturasProvider = ({ children }) => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    const value = {
        refreshTrigger,
        triggerRefresh
    };

    return (
        <CandidaturasContext.Provider value={value}>
            {children}
        </CandidaturasContext.Provider>
    );
};
