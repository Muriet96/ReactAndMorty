export const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'Alive':
        return '🟢';
      case 'Dead':
        return '🔴';
      default:
        return '⚪️';
    }
  };