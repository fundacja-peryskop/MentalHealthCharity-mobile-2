const buildQuery = (params: Record<string, any>) => {
    const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined));
    const queryParams = new URLSearchParams(filteredParams);
    return queryParams.toString();
};

export default buildQuery;