export function mapHttpError(status, message) {
    switch (status) {
        case 401:
            return {
                code: 'AUTH_EXPIRED',
                message: message || 'Authentication expired. Please re-authenticate.',
                status: 401,
            };
        case 403:
            return {
                code: 'PERMISSION_DENIED',
                message: message || 'Permission denied. You do not have access to this resource.',
                status: 403,
            };
        case 404:
            return {
                code: 'ENDPOINT_CHANGED',
                message: message || 'Endpoint not found. The API may have changed.',
                status: 404,
            };
        default:
            return {
                code: 'UNKNOWN_ERROR',
                message: message || `Unexpected error (HTTP ${status})`,
                status,
            };
    }
}
export function mapSchemaDriftError(message) {
    return {
        code: 'ENDPOINT_CHANGED',
        message: message || 'Schema drift detected. The API response format has changed.',
        status: 0,
    };
}
export function mapLoginHtmlError() {
    return {
        code: 'ENDPOINT_CHANGED',
        message: 'Received login HTML instead of API response. The endpoint may have changed.',
        status: 0,
    };
}
//# sourceMappingURL=errors.js.map