export type SignalState = 'thinking' | 'searching' | 'listening' | 'composing' | 'connecting' | 'complete';
export type SignalVariant = 'auto' | 'fold' | 'trace' | 'tide' | 'loom' | 'link' | 'bloom' | 'reactor' | 'gyre' | 'prism' | 'echo' | 'helix' | 'rift';
export interface VeylSignalElement extends HTMLElement {
  state: SignalState;
  variant: SignalVariant;
  size: number;
  speed: number;
  intensity: number;
  paused: boolean;
}
declare global {
  interface HTMLElementTagNameMap { 'veyl-signal': VeylSignalElement; }
}
