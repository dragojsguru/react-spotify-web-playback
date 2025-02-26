import { canUseDOM as canUseDOMBool } from 'exenv';

import { Locale } from './types';

export const canUseDOM = () => canUseDOMBool;

export const STATUS = {
  ERROR: 'ERROR',
  IDLE: 'IDLE',
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
  RUNNING: 'RUNNING',
  UNSUPPORTED: 'UNSUPPORTED',
};

export const TYPE = {
  DEVICE: 'device_update',
  FAVORITE: 'favorite_update',
  PLAYER: 'player_update',
  PROGRESS: 'progress_update',
  STATUS: 'status_update',
  TRACK: 'track_update',
};

export function getLocale(locale?: Partial<Locale>): Locale {
  return {
    devices: 'Devices',
    next: 'Next',
    pause: 'Pause',
    play: 'Play',
    previous: 'Previous',
    title: '{name} on SPOTIFY',
    volume: 'Volume',
    ...locale,
  };
}

export function getSpotifyLink(uri: string): string {
  const [, type = '', id = ''] = uri.split(':');

  return `https://open.spotify.com/${type}/${id}`;
}

export function getSpotifyLinkTitle(name: string, locale: string): string {
  return locale.replace('{name}', name);
}

export function getSpotifyURIType(uri: string): string {
  const [, type = ''] = uri.split(':');

  return type;
}

export function isEqualArray(A?: any, B?: any) {
  if (!Array.isArray(A) || !Array.isArray(B) || A.length !== B.length) {
    return false;
  }

  let result = true;

  A.forEach((a: string) =>
    B.forEach((b: string) => {
      result = a === b;
    }),
  );

  return result;
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function loadSpotifyPlayer(): Promise<any> {
  return new Promise<void>((resolve, reject) => {
    const scriptTag = document.getElementById('spotify-player');

    if (!scriptTag) {
      const script = document.createElement('script');

      script.id = 'spotify-player';
      script.type = 'text/javascript';
      script.async = false;
      script.defer = true;
      script.src = './spotify.js';
      script.onload = () => resolve();
      script.onerror = (error: any) => reject(new Error(`loadScript: ${error.message}`));

      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}

export function parseVolume(value?: unknown): number {
  if (!isNumber(value)) {
    return 1;
  }

  if (value > 1) {
    return value / 100;
  }

  return value;
}

/**
 * Round decimal numbers
 */
export function round(number: number, digits = 2) {
  const factor = 10 ** digits;

  return Math.round(number * factor) / factor;
}

export function validateURI(input: string): boolean {
  const validTypes = ['album', 'artist', 'playlist', 'show', 'track'];

  /* istanbul ignore else */
  if (input && input.indexOf(':') > -1) {
    const [key, type, id] = input.split(':');

    /* istanbul ignore else */
    if (key === 'spotify' && validTypes.indexOf(type) >= 0 && id.length === 22) {
      return true;
    }
  }

  return false;
}
