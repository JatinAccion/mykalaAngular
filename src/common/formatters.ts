export function formatPhoneNumber(value) {
    const f_val = value.replace(/\D[^\.]/g, '');
    return `${f_val.slice(0, 3)}-${f_val.slice(3, 6)}-${f_val.slice(6)}`;
}
