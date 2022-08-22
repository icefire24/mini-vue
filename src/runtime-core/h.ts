import { createVnode } from './createVnode';

export function h(type,props?,children?) {
    return createVnode(type,props,children)
}