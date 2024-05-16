export const useIdFilters = () => {
    const idShort = (v) => {
        return v.slice(0, 3)+'...'+v.slice(-3)
    };
    return {
        idShort,
    };
};
