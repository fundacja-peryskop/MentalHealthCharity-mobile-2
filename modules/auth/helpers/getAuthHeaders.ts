import * as SecureStore from "expo-secure-store";

type GetAuthHeadersOptions = {
    withContentType?: boolean;
};

const getAuthHeaders = (options: GetAuthHeadersOptions = {}): Headers => {
    const { withContentType = true } = options;

    const headers = new Headers();

    const jwtToken = SecureStore.getItem("token");
    const jwtTokenType = SecureStore.getItem("jwt_type") ?? "Bearer";

    if (withContentType) {
        headers.append("Content-Type", "application/json");
    }

    if (jwtToken) {
        headers.append("Authorization", `${jwtTokenType} ${jwtToken}`);
    }

    return headers;
};

export default getAuthHeaders;
