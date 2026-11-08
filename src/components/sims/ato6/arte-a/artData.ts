import type { CaseVerdict } from '../cases';
import type { FoodId } from '../foodContent';

/** Constantes da arte A do Ato VI (separadas dos componentes por causa do fast refresh). */

/** Folhas em verde-musgo (não confundir com o verde brilhante do NO); beterraba em magenta. */
export const VEG_COLOR: Record<FoodId, string> = { rucula: '#6FB083', beterraba: '#C0266B', espinafre: '#3F8A5E', aipo: '#B5D98F' };

export type ProductKind = 'po' | 'mista' | 'conc' | 'suco';
/** Ordem das prateleiras (igual a SHELVES): pós, bebidas mistas, concentrados, sucos a granel. */
export const KINDS: readonly ProductKind[] = ['po', 'mista', 'conc', 'suco'];

/** Rótulo curto do selo: resume o `headline` de cada caso, sem número novo. */
export const SEAL: Record<CaseVerdict['id'], readonly [string, string]> = {
    lia: ['vale', 'testar'], tomas: ['nada', 'na média'], bruno: ['depende do', 'protocolo'], helena: ['ganho', 'incerto'],
};
