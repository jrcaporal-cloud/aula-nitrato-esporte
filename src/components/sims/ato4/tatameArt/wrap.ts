/** Quebra um texto em linhas de até `max` caracteres (palavras inteiras). */
export const wrap = (text: string, max: number): string[] =>
    text.split(' ').reduce<string[]>((lines, word) => {
        const last = lines[lines.length - 1];
        if (last !== undefined && `${last} ${word}`.length <= max) return [...lines.slice(0, -1), `${last} ${word}`];
        return [...lines, word];
    }, []);
