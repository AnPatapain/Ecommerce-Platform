/**
 * Check whether email is valid
 *
 * Copied from: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
 */
export function getEmailValidator() {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
}