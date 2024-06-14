import { useState } from 'react';

export function usePageState(initialPage: number = 1) {
  return useState(initialPage);
}