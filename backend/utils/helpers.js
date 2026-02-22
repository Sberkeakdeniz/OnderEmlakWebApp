/**
 * Escapes special regex characters in a string to prevent ReDoS attacks
 * and unintended pattern matching when using user input in RegExp.
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { escapeRegex };
