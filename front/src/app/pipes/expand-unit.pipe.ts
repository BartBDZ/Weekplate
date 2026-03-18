import { Pipe, PipeTransform } from '@angular/core';

interface UnitForms {
  singular: string;  // 1 gram
  plural: string;    // 2 gramy
  genitive: string;  // 5 gramów
}

const UNIT_MAP: Record<string, UnitForms> = {
  'g':            { singular: 'gram',        plural: 'gramy',       genitive: 'gramów' },
  'kg':           { singular: 'kilogram',    plural: 'kilogramy',   genitive: 'kilogramów' },
  'dag':          { singular: 'dekagram',    plural: 'dekagramy',   genitive: 'dekagramów' },
  'dkg':          { singular: 'dekagram',    plural: 'dekagramy',   genitive: 'dekagramów' },
  'ml':           { singular: 'mililitr',    plural: 'mililitry',   genitive: 'mililitrów' },
  'l':            { singular: 'litr',        plural: 'litry',       genitive: 'litrów' },
  'szt':          { singular: 'sztuka',      plural: 'sztuki',      genitive: 'sztuk' },
  'łyżka':        { singular: 'łyżka',       plural: 'łyżki',       genitive: 'łyżek' },
  'łyżki':        { singular: 'łyżka',       plural: 'łyżki',       genitive: 'łyżek' },
  'łyżeczka':     { singular: 'łyżeczka',    plural: 'łyżeczki',    genitive: 'łyżeczek' },
  'łyżeczki':     { singular: 'łyżeczka',    plural: 'łyżeczki',    genitive: 'łyżeczek' },
  'szklanka':     { singular: 'szklanka',    plural: 'szklanki',    genitive: 'szklanek' },
  'szklanki':     { singular: 'szklanka',    plural: 'szklanki',    genitive: 'szklanek' },
  'puszka':       { singular: 'puszka',      plural: 'puszki',      genitive: 'puszek' },
  'puszki':       { singular: 'puszka',      plural: 'puszki',      genitive: 'puszek' },
  'garść':        { singular: 'garść',       plural: 'garście',     genitive: 'garści' },
  'garście':      { singular: 'garść',       plural: 'garście',     genitive: 'garści' },
  'plaster':      { singular: 'plaster',     plural: 'plastry',     genitive: 'plastrów' },
  'ząbek':        { singular: 'ząbek',       plural: 'ząbki',       genitive: 'ząbków' },
  'ząbki':        { singular: 'ząbek',       plural: 'ząbki',       genitive: 'ząbków' },
  'opakowanie':   { singular: 'opakowanie',  plural: 'opakowania',  genitive: 'opakowań' },
  'opakowania':   { singular: 'opakowanie',  plural: 'opakowania',  genitive: 'opakowań' },
  'torebka':      { singular: 'torebka',     plural: 'torebki',     genitive: 'torebek' },
  'kawałek':      { singular: 'kawałek',     plural: 'kawałki',     genitive: 'kawałków' },
  'pęczek':       { singular: 'pęczek',      plural: 'pęczki',      genitive: 'pęczków' },
  'liść':         { singular: 'liść',        plural: 'liście',      genitive: 'liści' },
  'gałązka':      { singular: 'gałązka',     plural: 'gałązki',     genitive: 'gałązek' },
};

function getForm(qty: number | null | undefined): 'singular' | 'plural' | 'genitive' {
  if (qty == null || qty !== Math.floor(qty)) return 'genitive';
  if (qty === 1) return 'singular';
  const lastTwo = qty % 100;
  const lastOne = qty % 10;
  if (lastTwo >= 12 && lastTwo <= 14) return 'genitive';
  if (lastOne >= 2 && lastOne <= 4) return 'plural';
  return 'genitive';
}

export function expandUnit(unit: string | null | undefined, qty?: number | null): string {
  if (!unit) return '';
  const forms = UNIT_MAP[unit.trim().toLowerCase()];
  if (!forms) return unit;
  return forms[getForm(qty)];
}

@Pipe({ name: 'expandUnit', standalone: true, pure: true })
export class ExpandUnitPipe implements PipeTransform {
  transform(unit: string | null | undefined, qty?: number | null): string {
    return expandUnit(unit, qty);
  }
}
