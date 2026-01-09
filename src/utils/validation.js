export const validateWord = (word) => {
    const errors = {};

    if (!word.word || !word.word.trim()) {
        errors.word = 'Word is required';
    } else if (word.word.trim().length < 2) {
        errors.word = 'Word must be at least 2 characters';
    } else if (word.word.trim().length > 50) {
        errors.word = 'Word must not exceed 50 characters';
    } else if (!/^[a-zA-Z\s-']+$/.test(word.word.trim())) {
        errors.word = 'Word must contain only letters, spaces, hyphens, and apostrophes';
    }

    if (!word.type) {
        errors.type = 'Word type is required';
    }

    return errors;
};