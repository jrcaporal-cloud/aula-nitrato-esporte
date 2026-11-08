import type { Ctl, Sim } from './sim';

/** Refs lidas por quadro (a simulação e os controles nunca passam pelo estado do React). */
export type SimRef = { readonly current: Sim };
export type CtlRef = { readonly current: Ctl };
