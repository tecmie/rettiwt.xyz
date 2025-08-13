export default {
  global: {
    body: {
      color: 'default',
      bg: 'bg-canvas',
    },
    '*::placeholder': {
      opacity: 1,
      color: 'subtle',
    },
    '*, *::before, &::after': {
      borderColor: 'gray.200',
    },
  },
};
