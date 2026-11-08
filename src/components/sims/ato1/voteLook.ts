import { C } from '../kit/palette';
import type { Vote } from './claims';

/** Cor de cada resposta: verdadeiro = lima (C.ok), falso = vermelho (C.risk). */
export const VOTE_COLOR: Readonly<Record<Vote, string>> = { V: C.ok, F: C.risk };
