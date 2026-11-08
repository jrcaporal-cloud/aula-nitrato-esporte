import { VOTES_KEY, type Vote } from './claims';

/** Votos da turma por frase (id → voto). Imutável: cada mudança devolve um objeto novo. */
export type Votes = Readonly<Record<number, Vote | undefined>>;

/** Lê os votos salvos; sem storage ou com dado estragado, volta vazio. */
export const readVotes = (): Votes => {
    try {
        const raw = window.localStorage.getItem(VOTES_KEY);
        if (!raw) return {};
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) return {};
        const clean: Record<number, Vote> = {};
        for (const [key, value] of Object.entries(parsed)) {
            if (value === 'V' || value === 'F') clean[Number(key)] = value;
        }
        return clean;
    } catch {
        return {};
    }
};

/** Grava só os votos preenchidos. Se o navegador negar o storage, a votação segue na memória. */
export const writeVotes = (votes: Votes): void => {
    try {
        const out: Record<string, Vote> = {};
        for (const [key, value] of Object.entries(votes)) {
            if (value) out[key] = value;
        }
        window.localStorage.setItem(VOTES_KEY, JSON.stringify(out));
    } catch {
        // modo privado ou storage bloqueado: sem persistência, sem erro
    }
};

/** Marca o voto; tocar de novo no mesmo botão desfaz. */
export const withVote = (votes: Votes, id: number, vote: Vote): Votes => ({
    ...votes,
    [id]: votes[id] === vote ? undefined : vote,
});
