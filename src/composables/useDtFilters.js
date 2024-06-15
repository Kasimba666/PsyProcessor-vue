export const useDtFilters = () => {
    const dtIsoShort = (dtISO) => {
        let result = dtISO.substring(0, 19).split('');
        result[10] = ' ';
        result[13] = ':';
        result[16] = ':';
        return result.join('');
    };
    const dtIsoFileName = (dtISO) => {
        let result = dtISO.substring(0, 19).split('');
        result[10] = '_';
        result[13] = '-';
        result[16] = '-';
        return result.join('');
    };
    return {
        dtIsoShort,
        dtIsoFileName,
    };
};
